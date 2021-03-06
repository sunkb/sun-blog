<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- **Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->

<!-- - [XSS](#xss)
  - [如何攻击](#%E5%A6%82%E4%BD%95%E6%94%BB%E5%87%BB)
  - [如何防御](#%E5%A6%82%E4%BD%95%E9%98%B2%E5%BE%A1)
  - [CSP](#csp)
- [CSRF](#csrf)
  - [如何攻击](#%E5%A6%82%E4%BD%95%E6%94%BB%E5%87%BB-1)
  - [如何防御](#%E5%A6%82%E4%BD%95%E9%98%B2%E5%BE%A1-1)
    - [SameSite](#samesite)
    - [验证 Referer](#%E9%AA%8C%E8%AF%81-referer)
    - [Token](#token)
- [密码安全](#%E5%AF%86%E7%A0%81%E5%AE%89%E5%85%A8)
  - [加盐](#%E5%8A%A0%E7%9B%90) -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## XSS

> **跨网站指令码**（英语：Cross-site scripting，通常简称为：XSS）是一种网站应用程式的安全漏洞攻击，是[代码注入](https://www.wikiwand.com/zh-hans/%E4%BB%A3%E7%A2%BC%E6%B3%A8%E5%85%A5)的一种。它允许恶意使用者将程式码注入到网页上，其他使用者在观看网页时就会受到影响。这类攻击通常包含了 HTML 以及使用者端脚本语言。

XSS 分为三种：反射型，存储型和 DOM-based

### 如何攻击

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站。

例如通过 URL 获取某些参数

```html
<!-- http://www.domain.com?name=<script>alert(1)</script> -->
<div>{{name}}</div>                                                  
```

上述 URL 输入可能会将 HTML 改为 `<div><script>alert(1)</script></div>` ，这样页面中就凭空多了一段可执行脚本。这种攻击类型是反射型攻击，也可以说是 DOM-based 攻击。

也有另一种场景，比如写了一篇包含攻击代码 `<script>alert(1)</script>` 的文章，那么可能浏览文章的用户都会被攻击到。这种攻击类型是存储型攻击，也可以说是 DOM-based 攻击，并且这种攻击打击面更广。

### 如何防御

最普遍的做法是转义输入输出的内容，对于引号，尖括号，斜杠进行转义

```js
function escape(str) {
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	str = str.replace(/"/g, "&quto;");
	str = str.replace(/'/g, "&#39;");
	str = str.replace(/`/g, "&#96;");
    str = str.replace(/\//g, "&#x2F;");
    return str
}
```

通过转义可以将攻击代码 `<script>alert(1)</script>` 变成

```js
// -> &lt;script&gt;alert(1)&lt;&#x2F;script&gt;
escape('<script>alert(1)</script>')
```

对于显示富文本来说，不能通过上面的办法来转义所有字符，因为这样会把需要的格式也过滤掉。这种情况通常采用白名单过滤的办法，当然也可以通过黑名单过滤，但是考虑到需要过滤的标签和标签属性实在太多，更加推荐使用白名单的方式。

```js
var xss = require("xss");
var html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>');
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html);
```

以上示例使用了 `js-xss` 来实现。可以看到在输出中保留了 `h1` 标签且过滤了 `script` 标签

### CSP

> 内容安全策略   ([CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP)) 是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/XSS)) 和数据注入攻击等。无论是数据盗取、网站内容污染还是散发恶意软件，这些攻击都是主要的手段。

我们可以通过 CSP 来尽量减少 XSS 攻击。CSP 本质上也是建立白名单，规定了浏览器只能够执行特定来源的代码。

通常可以通过 HTTP Header 中的 `Content-Security-Policy` 来开启 CSP

- 只允许加载本站资源

  ```http
  Content-Security-Policy: default-src ‘self’
  ```

- 只允许加载 HTTPS 协议图片

  ```http
  Content-Security-Policy: img-src https://*
  ```

- 允许加载任何来源框架

  ```http
  Content-Security-Policy: child-src 'none'
  ```

更多属性可以查看 [这里](https://content-security-policy.com/)

### http-only

不能通过 JS 访问 Cookie，减少 XSS 攻击

## CSRF

> **跨站请求伪造**（英语：Cross-site request forgery），也被称为 **one-click attack** 或者 **session riding**，通常缩写为 **CSRF** 或者 **XSRF**， 是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。[[1\]](https://www.wikiwand.com/zh/%E8%B7%A8%E7%AB%99%E8%AF%B7%E6%B1%82%E4%BC%AA%E9%80%A0#citenoteRistic1) 跟[跨網站指令碼](https://www.wikiwand.com/zh/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)（XSS）相比，**XSS** 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

简单点说，CSRF 就是利用用户的登录态发起恶意请求。

### 如何攻击

假设网站中有一个通过 Get 请求提交用户评论的接口，那么攻击者就可以在钓鱼网站中加入一个图片，图片的地址就是评论接口

```html
<img src="http://www.domain.com/xxx?comment='attack'"/>
```

 如果接口是 Post 提交的，就相对麻烦点，需要用表单来提交接口

```html
<form action="http://www.domain.com/xxx" id="CSRF" method="post">
    <input name="comment" value="attack" type="hidden">
</form>
```

### 如何防御

防范 CSRF 可以遵循以下几种规则：

1. Get 请求不对数据进行修改
2. 不让第三方网站访问到用户 Cookie
3. 阻止第三方网站请求接口
4. 请求时附带验证信息，比如验证码或者 token

#### SameSite

可以对 Cookie 设置 `SameSite` 属性。该属性设置 Cookie 不随着跨域请求发送，该属性可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。

#### 验证 Referer

对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。

#### Token

服务器下发一个随机 Token（算法不能复杂），每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。

## 密码安全

密码安全虽然大多是后端的事情，但是作为一名优秀的前端程序员也需要熟悉这方面的知识。

### 加盐

对于密码存储来说，必然是不能明文存储在数据库中的，否则一旦数据库泄露，会对用户造成很大的损失。并且不建议只对密码单纯通过加密算法加密，因为存在彩虹表的关系。

通常需要对密码加盐，然后进行几次不同加密算法的加密。

```js
// 加盐也就是给原密码添加字符串，增加原密码长度
sha256(sha1(md5(salt + password + salt)))
```

但是加盐并不能阻止别人盗取账号，只能确保即使数据库泄露，也不会暴露用户的真实密码。一旦攻击者得到了用户的账号，可以通过暴力破解的方式破解密码。对于这种情况，通常使用验证码增加延时或者限制尝试次数的方式。并且一旦用户输入了错误的密码，也不能直接提示用户输错密码，而应该提示账号或密码错误。

## 流量劫持

1. 首先访问 DNS 服务器，将域名转换为 IP 地址。 路由器 -> dns
2. 访问这个 IP 地址，这样用户就访问了目标网站。 路由器 -> 网站服务器
3. 如果是一个建设良好的网站，一般会把静态资源放在 CDN 上。 路由器 -> cdn

### DNS 的劫持与防治

#### 如何污染 DNS

1. 在用户设备上动手。这个主要是通过一些恶意软件实现的，比如早期一些流氓软件会在用户本机篡改hosts文件，影响用户的搜索引擎工作。

2. 污染中间链路设备。由于 DNS 查询是基于 UDP 协议明文发送的，因此在任意中间设备上——比如路由器——进行中间人攻击，修改 UDP 包的内容，就可以影响 DNS 的结果了。

3. 入侵 DNS 服务器。这是一种成本比较高的方案，看起来似乎很困难，但 DNS 是一种相对古老的技术，其服务软件的实现可能已经年久失修，别有用心的攻击者可以寻找一些缺乏维护的 DNS 服务器，施行攻击。另外，有时 DNS 服务器上不止运行 DNS 软件，还会有一些其他的软件也在运行，比如同时也启动了 HTTP 服务等，这时攻击者也可以通过这些软件的漏洞来控制服务器，进而影响 DNS 的解析。由于 DNS 的缓存和上下传递关系，一旦有 DNS 服务器被影响，就会一次影响很多用户的访问，因此非常危险。

#### 如何抵御 DNS 投毒

1. DNS over TLS。这种协议是在 TLS 协议之上传输 DNS 内容，有点类似 HTTPS 和 TLS 的关系。

2. DNS over HTTP。用 HTTP 协议来传输 DNS ，也是可以的。国内厂商当中对这种方案的支持较多。最简单的实现是使用一个 固定的 IP 地址作为域名服务器，每次不发生 UDP ，而是向这台服务器发送 HTTP 请求来获取解析结果。但通常很难签发相应的证书给固定 IP，因此也有些厂商自己对 HTTP 报文进行加密，从而防止这些解析结果再被中间人篡改。

3. DNS over HTTPS。和第二点比较类似，区别是使用了 HTTPS 协议。根据我的观察，采用这种方案的 Google 和 Cloudflare 都使用的是域名而非固定 IP ，因此还是要先解析一次域名服务器自身的域名才可以进行真正的查询。这可能会导致再次被中间人扰乱，从而迫使用户降级到普通的 UDP 方式上。

### HTTP 流量劫持

#### Content Security Policy

CSP 原本是为了和 XSS 对抗而产生的一种技术方案，其原理是在 HTML 加载的时候，指定每种资源的 URL 白名单规则，防止 XSS 的运行和数据外送。但如果巧妙利用规则，也可以让所有的资源强制走 https ，这样就可以降低流量劫持的可能性。

CSP 用来防劫持的缺点也比较明显：

1. CSP 可以用在 HTTP 页面，这也是我们想在 HTTP 页面用它做防御的一个原因。但中间人攻击可以在链路上直接移除 CSP 的相关标记，导致 CSP 全部失效。
2. CSP 规则设置比较复杂。不然也不会有一个网站专门用来查询和生成规则了。设置不当很容易玩脱，会直接导致你的资源不可用。
3. 影响动态创建脚本。CSP 存在的一部分意义就是阻止动态创建脚本这种行为，这是防御 XSS 的一种办法。但同时市面上很多技术方案也是基于这种方式做的，比如一些统计 SDK 之类的，甚至有些开发人员的开发模式即是如此。

#### Subresource Integrity
SRI 是专门用来校验资源的一种方案，它读取资源标签中的integrity属性，将其中的信息摘要值，和资源实际的信息摘要值进行对比，如果发现无法匹配，那么浏览器就会拒绝执行资源。对于script标签来说，就是拒绝执行其中的代码，对于 CSS 来说则是不加载其中的样式。

理想上来说，这样的方案可以杜绝中间人对资源的篡改。不过和 CSP 一样，它也有自己的局限性：

1. 和 CSP 一样，当我们用在 HTTP 页面中时，中间人可以直接移除 SRI 的相关属性，这样就完全失效了。
2. 动态创建的脚本时，除非单独在前端计算信息摘要，否则无法使用 SRI 。
3. 如果中途因为某种原因修改了脚本内容而忘记了更新摘要值，那么会直接影响可用性。有些自作聪明的代理或资源托管服务器，会对 JavaScript 进行压缩或者混淆，而这个过程对开发者透明，这样也会导致可用性受到影响。
4. 兼容性比较有限。 iOS Safari 的支持至少需要 iOS 11，在目前看来不是很理想。

### HTTPS 的劫持与防治

#### SSL strip

在 HTTPS 协议建立之前，浏览器可能并不知道网站是基于 HTTPS 的，因此首先会去使用 HTTP 协议来访问网站，然后再经由网站的跳转改为 HTTPS 协议。

中间人在这个过程中，实际上可以屏蔽掉这个跳转响应，自己和网站服务器建立 HTTPS 连接，而继续和被劫持的浏览器之间使用 HTTP 协议。如此一来，流量劫持就会退回到 HTTP 协议时的难度。

为防止这样的情况发生，IETF 推出了一项提案——HSTS（HTTP Strict-Transport-Security）

HSTS的做法是，在HTTPS响应报文的头部中，增加一个名为Strict-Transport-Security的头，内容是这个头的有效期。当浏览器在 HTTPS 响应中看到它时，下一次浏览器会直接使用 HTTPS 来进行请求。

#### FREAK 攻击

FREAK 的原理在于， SSL 曾经支持过一种不安全的加密方式，而某些漏洞可以巧妙地触发这种不安全加密。中间人能够在密钥协商中截获 RSA 加密的公钥，并通过暴力破解来逆推出私钥。

一旦私钥被得出，该证书也就不再安全，后续的所有会话都会处于危险之中。

#### HTTPS 流量劫持
针对 SSL/TLS 攻击的尝试其实从未停止过，未来也不会就此罢休。除了上面列出的两种经典攻击之外，还有很多相似的案例。在防御 HTTPS 流量劫持上，除了使用 HTTPS 之外，更关键的是挑选一个相对安全的加密套件。

### CDN 与流量劫持

实际上 CDN 不仅能够起到就近服务的功能，同时也能够作为缓存，缓解我们自己网站服务器的压力——因为流量不来我们服务器了。但这也就引入了一个问题，那就是 CDN 上的资源何时更新的问题。现在的通行方案是， CDN 上只部署静态资源，将文档请求（HTML）仍然交给我们自己的服务器。

出现劫持一般有两种原因：一是 CDN 和用户之间，走的是 HTTP 协议，这种情况比较多见，解决起来比较容易，就是换成 HTTPS 协议；另一个是我们的服务器和 CDN 之间，以及 CDN 内部，是 HTTP 协议的，这样就比较头疼了。

另外，我们也曾遇到过不止一次 CDN 本身有故障的情况，如 CDN 的 HTTPS 证书过期、CDN 的 gzip 故障等。

#### 基于代码校验的防治方案

1. 我们监控的级别是业务级甚至页面级，而不是某个固定的资源
2. 在业务方的 Node.js 中内置逻辑，给予了业务方自己进行降级和响应的能力
3. 我们把核心的判断逻辑放在自己的服务中，可以通过集中分析来降低误判和警报风暴的可能，并且可以横向根据各接入方的情况，做进一步的推断
4. 我们自己维护的核心服务如果出现故障，不影响业务方的代码执行——既不影响浏览器中的逻辑也不影响业务方的 Node.js 逻辑

<!-- 参考链s接https://zhuanlan.zhihu.com/p/40682772 -->
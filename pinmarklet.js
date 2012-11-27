(function (window, document, navigator, options) {
    var app = window[options.pin_id] = {
        window: window,
        document: document,
        navigator: navigator,
        options: options,
        s: {},
        func: function () {
            return {
                callback: [],
                kill: function (id) {
                    if (typeof id === "string") id = app.document.getElementById(id);
                    id && id.parentNode && id.parentNode.removeChild(id)
                },
                get: function (node, attributeName) {
                    var d = null;
                    return d = node[attributeName] || node.getAttribute(attributeName)
                },
                set: function (node, attributeName, attributeValue) {
                    if (typeof node[attributeName] === "string") node[attributeName] = attributeValue;
                    else node.setAttribute(attributeName, attributeValue);
                },
                make: function (b) {
                    var c = false,
                        d, e;
                    for (tagName in b) if (b[tagName].hasOwnProperty) {
                        c = app.document.createElement(tagName);
                        for (e in b[tagName]) if (b[tagName][e].hasOwnProperty) if (typeof b[tagName][e] === "string") c[e] = b[tagName][e];
                        break
                    }
                    return c
                },
                listen: function (b, c, d) {
                    if (typeof app.window.addEventListener !== "undefined") b.addEventListener(c, d, false);
                    else typeof app.window.attachEvent !== "undefined" && b.attachEvent("on" + c, d)
                },
                getSelection: function () {
                    return ("" + (app.window.getSelection ? app.window.getSelection() : app.document.getSelection ? app.document.getSelection() : app.document.selection.createRange().text)).replace(/(^\s+|\s+$)/g, "")
                },
                pin: function (b) {
                    var url = app.options.pin + "?",
                        is_video = "false",
                        media = app.func.get(b, "pinImg"),
                        page_url = app.func.get(b, "pinUrl") || app.document.URL,
                        description = app.v.selectedText || app.func.get(b, "pinDesc") || app.document.title;

                    if (b.rel === "video") is_video = "true";
                    url = url + "media=" + encodeURIComponent(media);
                    url = url + "&url=" + encodeURIComponent(page_url);
                    url = url + "&title=" + encodeURIComponent(app.document.title.substr(0, 500));
                    url = url + "&is_video=" + is_video;
                    url = url + "&description=" + encodeURIComponent(description.substr(0, 500));
                    if (app.v.inlineHandler) url = url + "&via=" + encodeURIComponent(app.document.URL);
                    if (app.v.hazIOS) app.window.location = "http://" + url;
                    else app.window.open("http://" + url, "pin" + (new Date).getTime(), app.options.pop)
                },
                close: function (b) {
                    if (app.s.bg) {
                        app.document.b.removeChild(app.s.shim);
                        app.document.b.removeChild(app.s.bg);
                        app.document.b.removeChild(app.s.bd)
                    }
                    window.hazPinningNow = false;
                    b && app.window.alert(b);
                    app.v.hazGoodUrl = false;
                    app.window.scroll(0, app.v.saveScrollTop)
                },
                click: function (b) {
                    b = b || app.window.event;
                    var c = null;
                    if (c = b.target ? b.target.nodeType === 3 ? b.target.parentNode : b.target : b.srcElement) if (c === app.s.x) app.func.close();
                    else if (c.className !== app.options.pin_id + "_hideMe") if (c.className === app.options.pin_id + "_pinThis") {
                        app.func.pin(c);
                        app.window.setTimeout(function () {
                            app.func.close()
                        }, 10)
                    }
                },
                behavior: function () {
                    app.func.listen(app.s.bd, "click", app.func.click)
                },
                presentation: function () {
                    var b = app.func.make({
                        STYLE: {
                            type: "text/css"
                        }
                    }),
                        c = app.options.cdn[app.window.location.protocol] || app.options.cdn["http:"],
                        d = app.options.rules.join("\n");
                    d = d.replace(/#_/g, "#" + options.pin_id + "_");
                    d = d.replace(/\._/g, "." + options.pin_id + "_");
                    d = d.replace(/_cdn/g, c);
                    if (b.styleSheet) b.styleSheet.cssText = d;
                    else b.appendChild(app.document.createTextNode(d));
                    app.document.h.appendChild(b)
                },
                addThumb: function (b, c, tagName) {
                    (d = b.getElementsByTagName(tagName)[0]) ? b.insertBefore(c, tagName) : b.appendChild(c)
                },
                thumb: function (b) {
                    if (b.src) {
                        if (!b.media) b.media = "image";
                        var c = app.options.pin_id + "_thumb_" + b.src,
                            d = app.func.make({
                                SPAN: {
                                    className: app.options.pin_id + "_pinContainer"
                                }
                            }),
                            e = app.func.make({
                                A: {
                                    className: app.options.pin_id + "_pinThis",
                                    rel: b.media,
                                    href: "#"
                                }
                            }),
                            g = app.func.make({
                                SPAN: {
                                    className: app.options.pin_id + "_img"
                                }
                            }),
                            f = new Image;
                        app.func.set(f, "nopin", "nopin");
                        app.func.set(f, "pinterestCreated", "pinterestCreated");
                        b.page && app.func.set(e, "pinUrl", b.page);
                        if (app.v.canonicalTitle || b.title) app.func.set(e, "pinDesc", app.v.canonicalTitle || b.title);
                        b.desc && app.func.set(e, "pinDesc", b.desc);
                        f.style.visibility = "hidden";
                        f.onload = function () {
                            var i = this.width,
                                h = this.height;
                            if (h === i) this.width = this.height = app.options.thumbCellSize;
                            if (h > i) {
                                this.width = app.options.thumbCellSize;
                                this.height = app.options.thumbCellSize * (h / i);
                                this.style.marginTop = 0 - (this.height - app.options.thumbCellSize) / 2 + "px"
                            }
                            if (h < i) {
                                this.height = app.options.thumbCellSize;
                                this.width = app.options.thumbCellSize * (i / h);
                                this.style.marginLeft = 0 - (this.width - app.options.thumbCellSize) / 2 + "px"
                            }
                            this.style.visibility = ""
                        };
                        f.src = b.thumb ? b.thumb : b.src;
                        app.func.set(e, "pinImg", b.src);
                        if (b.extended) f.className = "extended";
                        g.appendChild(f);
                        d.appendChild(g);
                        b.media !== "image" && d.appendChild(app.func.make({
                            SPAN: {
                                className: app.options.pin_id + "_play"
                            }
                        }));
                        g = app.func.make({
                            CITE: {}
                        });
                        g.appendChild(app.func.make({
                            span: {
                                className: app.options.pin_id + "_mask"
                            }
                        }));
                        f = b.height + " x " + b.width;
                        if (b.duration) {
                            f = b.duration % 60;
                            if (f < 10) f = "0" + f;
                            f = ~~ (b.duration / 60) + ":" + f
                        }
                        if (b.total_slides) f = b.total_slides + " slides";
                        f = app.func.make({
                            span: {
                                innerHTML: f
                            }
                        });
                        if (b.provider) f.className = app.options.pin_id + "_" + b.provider;
                        g.appendChild(f);
                        d.appendChild(g);
                        d.appendChild(e);
                        e = false;
                        if (b.dupe) {
                            f = 0;
                            for (var g = app.v.thumbed.length; f < g; f += 1) if (app.v.thumbed[f].id.indexOf(b.dupe) !== -1) {
                                e = app.v.thumbed[f].id;
                                break
                            }
                        }
                        if (e !== false) if (e = app.document.getElementById(e)) {
                            e.parentNode.insertBefore(d, e);
                            e.parentNode.removeChild(e)
                        } else b.page || b.media !== "image" ? app.func.addThumb(app.s.embedContainer, d, "SPAN") : app.func.addThumb(app.s.imgContainer, d, "SPAN");
                        else {
                            app.s.imgContainer.appendChild(d);
                            app.v.hazAtLeastOneGoodThumb += 1
                        }(b = app.document.getElementById(c)) && b.parentNode.removeChild(b);
                        document.id = c;
                        app.v.thumbed.push(d)
                    }
                },
                call: function (b, c) {
                    var d = app.func.callback.length,
                        e = app.options.pin_id + ".func.callback[" + d + "]",
                        f = app.document.createElement("SCRIPT");
                    app.func.callback[d] = function (g) {
                        c(g, d);
                        app.v.awaitingCallbacks -= 1;
                        app.func.kill(e)
                    };
                    f.id = e;
                    f.src = b + "&callback=" + e;
                    f.type = "text/javascript";
                    f.charset = "utf-8";
                    app.v.firstScript.parentNode.insertBefore(f, app.v.firstScript);
                    app.v.awaitingCallbacks += 1
                },
                ping: {
                    checkDomain: function (b) {
                        if (b && b.disallowed_domains && b.disallowed_domains.length) for (var c = 0, d = b.disallowed_domains.length; c < d; c += 1) b.disallowed_domains[c] === app.window.location.host && app.func.close(app.options.msg.noPin)
                    },
                    info: function (b) {
                        if (b) if (b.err) app.func.unThumb(b.id);
                        else if (b.reply && b.reply.img && b.reply.img.src) {
                            var c = "";
                            if (b.reply.page) c = b.reply.page;
                            b.reply.nopin && b.reply.nopin === 1 ? app.func.unThumb(b.id) : app.func.thumb({
                                src: b.reply.img.src,
                                height: b.reply.img.height,
                                width: b.reply.img.width,
                                media: b.reply.media,
                                title: b.reply.description,
                                page: c,
                                dupe: b.id
                            })
                        }
                    }
                },
                unThumb: function (b) {
                    if (b = app.document.getElementById(app.options.pin_id + "_thumb_" + b)) {
                        var c = b.getElementsByTagName("SPAN")[0];
                        b.removeChild(c);
                        c = app.func.make({
                            SPAN: {
                                className: app.options.pin_id + "_hideMe",
                                innerHTML: app.options.msg.grayOut
                            }
                        });
                        b.appendChild(c);
                        app.v.hazAtLeastOneGoodThumb -= 1
                    }
                },
                getExtendedInfo: function (b) {
                    if (!app.v.hazCalledForInfo[b]) {
                        app.v.hazCalledForInfo[b] = true;
                        app.func.call(app.options.embed + b, app.func.ping.info)
                    }
                },
                getId: function (b) {
                    for (var c, d = b.u.split("?")[0].split("#")[0].split("/"); !c;) c = d.pop();
                    if (b.r) c = parseInt(c, b.r);
                    return encodeURIComponent(c)
                },
                hazUrl: {
                    flickr: function () {
                        var b = app.document.getElementById("image-src");
                        if (b && b.href) {
                            var c = new Image;
                            c.onload = function () {
                                app.func.thumb({
                                    src: this.src,
                                    height: this.height,
                                    width: this.width
                                });
                                app.func.getExtendedInfo("src=flickr&id=" + encodeURIComponent(app.v.canonicalImage))
                            };
                            c.src = app.v.canonicalImage = b.href.split("_m.jpg")[0] + "_z.jpg"
                        }
                    },
                    vimeo: function () {
                        var b = app.func.getId({
                            u: app.document.URL,
                            r: 10
                        });
                        app.document.getElementsByTagName("DIV");
                        app.document.getElementsByTagName("LI");
                        app.document.getElementsByTagName("A");
                        var c = "vimeo";
                        if (app.document.URL.match(/^https/)) c += "_s";
                        b > 1E3 && app.func.getExtendedInfo("src=" + c + "&id=" + b)
                    },
                    youtube: function () {
                        for (var b = app.document.getElementsByTagName("META"), c = 0, d = b.length; c < d; c += 1) {
                            var e = app.func.get(b[c], "property");
                            if (e === "og:url") {
                                app.v.canonicalUrl = app.func.get(b[c], "content");
                                app.v.canonicalId = app.v.canonicalUrl.split("=")[1].split("&")[0]
                            }
                            if (e === "og:image") app.v.canonicalImage = app.func.get(b[c], "content")
                        }
                        if (app.v.canonicalImage && app.v.canonicalUrl) {
                            b = new Image;
                            b.onload = function () {
                                app.func.thumb({
                                    src: this.src,
                                    height: this.height,
                                    width: this.width,
                                    type: "video"
                                });
                                app.func.getExtendedInfo("src=youtube&id=" + encodeURIComponent(app.v.canonicalId))
                            };
                            b.src = app.v.canonicalImage
                        } else {
                            app.v.canonicalImage = null;
                            app.v.canonicalUrl = null
                        }
                    },
                    pinterest: function () {
                        app.func.close(app.options.msg.installed)
                    },
                    facebook: function () {
                        app.func.close(app.options.msg.privateDomain.replace(/%privateDomain%/, "Facebook"))
                    },
                    googleReader: function () {
                        app.func.close(app.options.msg.privateDomain.replace(/%privateDomain%/, "Google Reader"))
                    },
                    stumbleUpon: function () {
                        var b = 0,
                            c = app.options.stumbleFrame.length,
                            d;
                        for (b = 0; b < c; b += 1) if (d = app.document.getElementById(app.options.stumbleFrame[b])) {
                            app.func.close();
                            if (app.window.confirm(app.options.msg.bustFrame)) app.window.location = document.src;
                            break
                        }
                    },
                    googleImages: function () {
                        app.v.inlineHandler = "google"
                    },
                    tumblr: function () {
                        app.v.inlineHandler = "tumblr"
                    },
                    netflix: function () {
                        app.v.inlineHandler = "netflix"
                    }
                },
                hazSite: {
                    flickr: {
                        img: function (b) {
                            if (b.src) {
                                b.src = b.src.split("?")[0];
                                app.func.getExtendedInfo("src=flickr&id=" + encodeURIComponent(b.src))
                            }
                        }
                    },
                    behance: {
                        img: function (b) {
                            if (b.src) {
                                b.src = b.src.split("?")[0];
                                app.func.getExtendedInfo("src=behance&id=" + encodeURIComponent(b.src))
                            }
                        }
                    },
                    netflix: {
                        img: function (b) {
                            if (b = b.src.split("?")[0].split("#")[0].split("/").pop()) {
                                id = parseInt(b.split(".")[0]);
                                id > 1E3 && app.v.inlineHandler && app.v.inlineHandler === "netflix" && app.func.getExtendedInfo("src=netflix&id=" + id)
                            }
                        }
                    },
                    youtube: {
                        img: function (b) {
                            b = b.src.split("?")[0].split("#")[0].split("/");
                            b.pop();
                            (id = b.pop()) && app.func.getExtendedInfo("src=youtube&id=" + id)
                        },
                        iframe: function (b) {
                            (b = app.func.getId({
                                u: b.src
                            })) && app.func.getExtendedInfo("src=youtube&id=" + b)
                        },
                        video: function (b) {
                            (b = b.getAttribute("data-youtube-id")) && app.func.getExtendedInfo("src=youtube&id=" + b)
                        },
                        embed: function (b) {
                            var c = b.getAttribute("flashvars"),
                                d = "";
                            if (c) {
                                if (d = c.split("video_id=")[1]) d = document.split("&")[0];
                                d = encodeURIComponent(d)
                            } else d = app.func.getId({
                                u: b.src
                            });
                            d && app.func.getExtendedInfo("src=youtube&id=" + d)
                        },
                        object: function (b) {
                            b = b.getAttribute("data");
                            var c = "";
                            if (b)(c = app.func.getId({
                                u: b
                            })) && app.func.getExtendedInfo("src=youtube&id=" + c)
                        }
                    },
                    vimeo: {
                        iframe: function (b) {
                            b = app.func.getId({
                                u: b.src,
                                r: 10
                            });
                            b > 1E3 && app.func.getExtendedInfo("src=vimeo&id=" + b)
                        }
                    }
                },
                parse: function (b, c) {
                    b = b.split(c);
                    if (b[1]) return b[1].split("&")[0];
                    return ""
                },
                handleInline: {
                    google: function (b) {
                        var c, d, e = 0,
                            f = 0;
                        if (b.src) {
                            f = b.parentNode;
                            if (f.tagName === "A" && f.href) {
                                c = app.func.parse(f.href, "&imgrefurl=");
                                d = app.func.parse(f.href, "&imgurl=");
                                e = parseInt(app.func.parse(f.href, "&w="));
                                f = parseInt(app.func.parse(f.href, "&h="));
                                d && c && f > app.options.minImgSize && e > app.options.minImgSize && app.func.thumb({
                                    thumb: b.src,
                                    src: d,
                                    page: c,
                                    height: f,
                                    width: e
                                })
                            }
                        }
                    },
                    tumblr: function (b) {
                        var c = [];
                        c = null;
                        c = "";
                        if (b.src) {
                            for (c = b.parentNode; c.tagName !== "LI" && c !== app.document.b;) c = c.parentNode;
                            if (c.tagName === "LI" && c.parentNode.id === "posts") {
                                c = c.getElementsByTagName("A");
                                (c = c[c.length - 1]) && c.href && app.func.thumb({
                                    src: b.src,
                                    page: c.href,
                                    height: b.height,
                                    width: b.width
                                })
                            }
                        }
                    }
                },
                hazTag: {
                    img: function (b) {
                        if (app.v.inlineHandler && typeof app.func.handleInline[app.v.inlineHandler] === "function") app.func.handleInline[app.v.inlineHandler](b);
                        else b.src.match(/^data/) || b.height > app.options.minImgSize && b.width > app.options.minImgSize && app.func.thumb({
                            src: b.src,
                            height: b.height,
                            width: b.width
                        })
                    },
                    meta: function (b) {
                        var c, d;
                        if (b.name && b.name.toUpperCase() === "PINTEREST" && b.content && b.content.toUpperCase() === "NOPIN") if (d = app.func.get(b, "description")) {
                            c = "The owner of the site";
                            b = app.document.URL.split("/");
                            if (b[2]) c = b[2];
                            app.func.close(app.options.msg.noPinReason.replace(/%s%/, c) + "\n\n" + d)
                        } else app.func.close(app.options.msg.noPin)
                    }
                },
                checkTags: function () {
                    var b, c, d, e, f, g, h, i, j;
                    app.v.tag = [];
                    b = 0;
                    for (c = app.options.check.length; b < c; b += 1) {
                        f = app.document.getElementsByTagName(app.options.check[b]);
                        d = 0;
                        for (e = f.length; d < e; d += 1) {
                            g = f[d];
                            !g.getAttribute("nopin") && g.style.display !== "none" && g.style.visibility !== "hidden" && app.v.tag.push(g)
                        }
                    }
                    b = 0;
                    for (c = app.v.tag.length; b < c; b += 1) {
                        f = app.v.tag[b];
                        g = f.tagName.toLowerCase();
                        if (app.options.tag[g]) for (h in app.options.tag[g]) if (app.options.tag[g][h].hasOwnProperty) {
                            i = app.options.tag[g][h];
                            if (j = app.func.get(f, i.att)) {
                                d = 0;
                                for (e = i.match.length; d < e; d += 1) j.match(i.match[d]) && app.func.hazSite[h][g](f)
                            }
                        }
                        app.func.hazTag[g] && app.func.hazTag[g](f)
                    }
                },
                getHeight: function () {
                    return Math.max(Math.max(app.document.b.scrollHeight, app.document.d.scrollHeight), Math.max(app.document.b.offsetHeight, app.document.d.offsetHeight), Math.max(app.document.b.clientHeight, app.document.d.clientHeight))
                },
                structure: function () {

                    app.s.shim = app.func.make({
                        IFRAME: {
                            height: "100%",
                            width: "100%",
                            allowTransparency: true,
                            id: app.options.pin_id + "_shim"
                        }
                    });
                    app.func.set(app.s.shim, "nopin", "nopin");
                    app.func.set(app.s.shim, "pinterestCreated", "pinterestCreated");
                    app.document.b.appendChild(app.s.shim);
                    app.s.bg = app.func.make({
                        DIV: {
                            id: app.options.pin_id + "_bg"
                        }
                    });
                    app.document.b.appendChild(app.s.bg);
                    app.s.bd = app.func.make({
                        DIV: {
                            id: app.options.pin_id + "_bd"
                        }
                    });
                    app.s.hd = app.func.make({
                        DIV: {
                            id: app.options.pin_id + "_hd"
                        }
                    });
                    if (app.options.noHeader !== true) {
                        app.s.bd.appendChild(app.func.make({
                            DIV: {
                                id: app.options.pin_id + "_spacer"
                            }
                        }));
                        app.s.hd.appendChild(app.func.make({
                            SPAN: {
                                id: app.options.pin_id + "_logo"
                            }
                        }));
                        if (app.options.noCancel !== true) {
                            app.s.x = app.func.make({
                                A: {
                                    id: app.options.pin_id + "_x",
                                    innerHTML: app.options.msg.cancelTitle
                                }
                            });
                            app.s.hd.appendChild(app.s.x)
                        }
                    } else app.s.hd.className = "noHeader";
                    app.s.bd.appendChild(app.s.hd);
                    app.s.embedContainer = app.func.make({
                        SPAN: {
                            id: app.options.pin_id + "_embedContainer"
                        }
                    });
                    app.s.bd.appendChild(app.s.embedContainer);
                    app.s.imgContainer = app.func.make({
                        SPAN: {
                            id: app.options.pin_id + "_imgContainer"
                        }
                    });
                    app.s.bd.appendChild(app.s.imgContainer);
                    app.document.b.appendChild(app.s.bd);
                    var b = app.func.getHeight();
                    if (app.s.bd.offsetHeight < b) {
                        app.s.bd.style.height = b + "px";
                        app.s.bg.style.height = b + "px";
                        app.s.shim.style.height = b + "px"
                    }
                    app.window.scroll(0, 0);
                },
                checkUrl: function () {
                    var b;
                    for (b in app.options.url) if (app.options.url[b].hasOwnProperty) if (app.document.URL.match(app.options.url[b])) {
                        app.func.hazUrl[b]();
                        if (app.v.hazGoodUrl === false) return false
                    }
                    return true
                },
                checkPage: function () {
                    if (app.func.checkUrl()) {
                        app.v.canonicalImage || app.func.checkTags();
                        if (app.v.hazGoodUrl === false) return false
                    } else return false;
                    return true
                },
                init: function () {
                    app.document.d = app.document.documentElement;
                    app.document.b = app.document.getElementsByTagName("BODY")[0];
                    app.document.h = app.document.getElementsByTagName("HEAD")[0];
                    if (!app.document.b || !app.document.h) app.func.close(app.options.msg.noPinIncompletePage);
                    else if (window.hazPinningNow !== true) {
                        window.hazPinningNow = true;
                        var b, c = app.navigator.userAgent;
                        app.v = {
                            saveScrollTop: app.window.pageYOffset,
                            hazGoodUrl: true,
                            hazAtLeastOneGoodThumb: 0,
                            awaitingCallbacks: 0,
                            thumbed: [],
                            hazIE: function () {
                                return /msie/i.test(c) && !/opera/i.test(c)
                            }(),
                            hazIOS: function () {
                                return c.match(/iP/) !== null
                            }(),
                            firstScript: app.document.getElementsByTagName("SCRIPT")[0],
                            selectedText: app.func.getSelection(),
                            hazCalledForInfo: {}
                        };
                        b = app.options.checkDomain.url + "?domains=" + encodeURIComponent(app.window.location.host);
                        app.func.call(b, app.func.ping.checkDomain);
                        app.func.presentation();
                        app.func.structure();
                        if (app.func.checkPage()) if (app.v.hazGoodUrl === true) {
                            app.func.behavior();
                            if (app.func.callback.length > 1) app.v.waitForCallbacks = app.window.setInterval(function () {
                                if (app.v.awaitingCallbacks === 0) if (app.v.hazAtLeastOneGoodThumb === 0 || app.v.tag.length === 0) {
                                    app.window.clearInterval(app.v.waitForCallbacks);
                                    app.func.close(app.options.msg.notFound)
                                }
                            }, 500);
                            else if (!app.v.canonicalImage && (app.v.hazAtLeastOneGoodThumb === 0 || app.v.tag.length === 0)) app.func.close(app.options.msg.notFound)
                        }
                    }
                }
            }
        }()
    };
    app.func.init();
})(window, document, navigator, {
    pin_id: "PIN_" + (new Date).getTime(),
    checkDomain: {
        url: "//api.pinterest.com/v2/domains/filter_nopin/"
    },
    cdn: {
        "https:": "https://a248.e.akamai.net/passets.pinterest.com.s3.amazonaws.com",
        "http:": "http://passets-cdn.pinterest.com"
    },
    embed: "//pinterest.com/embed/?",
    pin: "pinterest.com/pin/create/bookmarklet/",
    minImgSize: 80,
    thumbCellSize: 200,
    check: [
        "meta",
        "iframe",
        "embed",
        "object",
        "img",
        "video",
        "a"
    ],
    url: {
        facebook: /^https?:\/\/.*?\.facebook\.com\//,
        flickr: /^https?:\/\/www\.flickr\.com\//,
        googleImages: /^https?:\/\/.*?\.google\.com\/search/,
        googleReader: /^https?:\/\/.*?\.google\.com\/reader\//,
        netflix: /^https?:\/\/.*?\.netflix\.com/,
        pinterest: /^https?:\/\/.*?\.?pinterest\.com\//,
        stumbleUpon: /^https?:\/\/.*?\.stumbleupon\.com\//,
        tumblr: /^https?:\/\/www\.tumblr\.com/,
        vimeo: /^https?:\/\/vimeo\.com\//,
        youtube: /^https?:\/\/www\.youtube\.com\/watch\?/
    },
    stumbleFrame: ["tb-stumble-frame", "stumbleFrame"],
    tag: {
        img: {
            flickr: {
                att: "src",
                match: [/staticflickr.com/, /static.flickr.com/]
            },
            behance: {
                att: "src",
                match: [/^http:\/\/behance\.vo\.llnwd\.net/]
            },
            netflix: {
                att: "src",
                match: [/^http:\/\/cdn-?[0-9]\.nflximg\.com/, /^http?s:\/\/netflix\.hs\.llnwd\.net/]
            },
            youtube: {
                att: "src",
                match: [/ytimg.com\/vi/, /img.youtube.com\/vi/]
            }
        },
        video: {
            youtube: {
                att: "src",
                match: [/videoplayback/]
            }
        },
        embed: {
            youtube: {
                att: "src",
                match: [/^http:\/\/s\.ytimg\.com\/yt/, /^http:\/\/.*?\.?youtube-nocookie\.com\/v/]
            }
        },
        iframe: {
            youtube: {
                att: "src",
                match: [/^http:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/]
            },
            vimeo: {
                att: "src",
                match: [/^http?s:\/\/vimeo.com\/(\d+)/, /^http:\/\/player\.vimeo\.com\/video\/(\d+)/]
            }
        },
        object: {
            youtube: {
                att: "data",
                match: [/^http:\/\/.*?\.?youtube-nocookie\.com\/v/]
            }
        }
    },
    msg: {
        check: "",
        cancelTitle: "Cancel",
        grayOut: "Sorry, cannot pin this image.",
        noPinIncompletePage: "Sorry, can't pin from non-HTML pages. If you're trying to upload an image, please visit pinterest.com.",
        bustFrame: "We need to hide the StumbleUpon toolbar to Pin from this page.  After pinning, you can use the back button in your browser to return to StumbleUpon. Click OK to continue or Cancel to stay here.",
        noPin: "Sorry, pinning is not allowed from this domain. Please contact the site operator if you have any questions.",
        noPinReason: "Pinning is not allowed from this page.\n\n%s% provided the following reason:",
        privateDomain: "Sorry, can't pin directly from %privateDomain%.",
        notFound: "Sorry, couldn't find any pinnable images or video on this page.",
        installed: "The bookmarklet is installed! Now you can click your Pin It button to pin images as you browse sites around the web."
    },
    pop: "status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=632,height=270,left=0,top=0",
    rules: [
        "#_shim {z-index:2147483640; position: absolute; background: transparent; top:0; right:0; bottom:0; left:0; width: 100%; border: 0;}",
        "#_bg {z-index:2147483641; position: absolute; top:0; right:0; bottom:0; left:0; background-color:#f2f2f2; opacity:.95; width: 100%; }",
        "#_bd {z-index:2147483642; position: absolute; text-align: center; width: 100%; top: 0; left: 0; right: 0; font:16px hevetica neue,arial,san-serif; }",
        "#_bd #_hd { z-index:2147483643; -moz-box-shadow: 0 1px 2px #aaa; -webkit-box-shadow: 0 1px 2px #aaa; box-shadow: 0 1px 2px #aaa; position: fixed; *position:absolute; width:100%; top: 0; left: 0; right: 0; height: 45px; line-height: 45px; font-size: 14px; font-weight: bold; display: block; margin: 0; background: #fbf7f7; border-bottom: 1px solid #aaa; }",
        "#_bd #_hd.noHeader { height: 1px; background-color:#f2f2f2; -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none; border: none; }",
        "#_bd #_hd a#_x { display: inline-block; cursor: pointer; color: #524D4D; line-height: 45px; text-shadow: 0 1px #fff; float: right; text-align: center; width: 100px; border-left: 1px solid #aaa; }",
        "#_bd #_hd a#_x:hover { color: #524D4D; background: #e1dfdf; text-decoration: none; }",
        "#_bd #_hd a#_x:active { color: #fff; background: #cb2027; text-decoration: none; text-shadow:none;}",
        "#_bd #_hd #_logo {height: 43px; width: 100px; display: inline-block; margin-right: -100px; background: transparent url(_cdn/images/LogoRed.png) 50% 50% no-repeat; border: none;}", "@media only screen and (-webkit-min-device-pixel-ratio: 2) { #_bd #_hd #_logo {background-size: 100px 26px; background-image: url(_cdn/images/LogoRed.2x.png); } }",
        "#_bd #_spacer { display: block; height: 50px; }",
        "#_bd span._pinContainer { height:200px; width:200px; display:inline-block; background:#fff; position:relative; -moz-box-shadow:0 0  2px #555; -webkit-box-shadow: 0 0  2px #555; box-shadow: 0 0  2px #555; margin: 10px; }",
        "#_bd span._pinContainer { zoom:1; *border: 1px solid #aaa; }",
        "#_bd span._pinContainer img { margin:0; padding:0; border:none; }",
        "#_bd span._pinContainer span._img, #_bd span._pinContainer span._play { position: absolute; top: 0; left: 0; height:200px; width:200px; overflow:hidden; }",
        "#_bd span._pinContainer span._play { background: transparent url(_cdn/images/bm/play.png) 50% 50% no-repeat; }",
        "#_bd span._pinContainer cite, #_bd span._pinContainer cite span { position: absolute; bottom: 0; left: 0; right: 0; width: 200px; color: #000; height: 22px; line-height: 24px; font-size: 10px; font-style: normal; text-align: center; overflow: hidden; }",
        "#_bd span._pinContainer cite span._mask { background:#eee; opacity:.75; *filter:alpha(opacity=75); }",
        "#_bd span._pinContainer cite span._behance { background: transparent url(_cdn/images/attrib/behance.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._dreamstime { background: transparent url(_cdn/images/attrib/dreamstime.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._flickr { background: transparent url(_cdn/images/attrib/flickr.png) 182px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._fivehundredpx { background: transparent url(_cdn/images/attrib/fivehundredpx.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._kickstarter { background: transparent url(_cdn/images/attrib/kickstarter.png) 182px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._slideshare { background: transparent url(_cdn/images/attrib/slideshare.png) 182px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._soundcloud { background: transparent url(_cdn/images/attrib/soundcloud.png) 182px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._vimeo { background: transparent url(_cdn/images/attrib/vimeo.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._vimeo_s { background: transparent url(_cdn/images/attrib/vimeo.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer cite span._youtube { background: transparent url(_cdn/images/attrib/youtube.png) 180px 3px no-repeat; }",
        "#_bd span._pinContainer a { text-decoration:none; background:transparent url(_cdn/images/bm/button.png) 60px 300px no-repeat; cursor:pointer; position:absolute; top:0; left:0; height:200px; width:200px; }",
        "#_bd span._pinContainer a { -moz-transition-property: background-color; -moz-transition-duration: .25s; -webkit-transition-property: background-color; -webkit-transition-duration: .25s; transition-property: background-color; transition-duration: .25s; }",
        "#_bd span._pinContainer a:hover { background-position: 60px 80px; background-color:rgba(0, 0, 0, 0.5); }",
        "#_bd span._pinContainer a._hideMe { background: rgba(128, 128, 128, .5); *background: #aaa; *filter:alpha(opacity=75); line-height: 200px; font-size: 10px; color: #fff; text-align: center; font-weight: normal!important; }"
    ]
});
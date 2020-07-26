"use strict";
angular.module("msResourceUrlManager", []), angular.module("msResourceUrlManager").factory("ResourceUrlManager", ["$location", function(a) {
        var b, c, d = function(a) {
            var b = c + a.pageId;
            return a.param1 ? (b += "/" + a.param1, a.param2 ? (b += "/" + a.param2, a.param3 ? (b += "/" + a.param3, a.param4 ? b += "/" + a.param4 : b) : b) : b) : b
        };
        return {
            setRouteParams: function(a, d) {
                b = a, c = d || ""
            },
            getAllParameters: function() {
                return b
            },
            setUrlParameters: function(b) {
                var c = d(b);
                a.path(c)
            },
            setSearchParameters: function() {}
        }
    }]), angular.module("msLayoutManager", []), angular.module("msLayoutManager").factory("LayoutService", ["PageBuilderManager", "LayoutServiceArrayHelper", "LayoutServiceFactoryHelper", "$q", "$rootScope", function(a, b, c, d, e) {
        var f = function(a) {
                g(a).then(function(a) {
                    if (a) {
                        var c = a.element;
                        a.parents.length > 1 && (c = a.parents[a.parents.length - 2]), b.recalculateWidths(c, 12)
                    }
                    e.$broadcast("recalculateWidth")
                })
            },
            g = function(c) {
                var e = d.defer();
                return a.getCurrentPage().then(function(a) {
                    var d = b.searchOnPageForElementAndParents(a, "id", c);
                    e.resolve(d)
                }), e.promise
            },
            h = function(a, f, h, i) {
                var j = d.defer(),
                    k = {
                        type: "page"
                    };
                return g(a).then(function(d) {
                    var e = c.getNewElement(k, h);
                    b.addElementOnArray(d.parents[0].content, d.index, e), l(a, e.content[0].id, !f), j.resolve({
                        success: !0
                    })
                }), e.$broadcast("markChanges", h.type + " content item has been added."), j.promise
            },
            i = function(a, c) {
                var f = d.defer();
                return g(a).then(function(a) {
                    var d = a.parents[0].content[a.index + 1];
                    if (d) {
                        var e = b.resizeElement(a.element, d, c);
                        return void f.resolve({
                            size: e
                        })
                    }
                    f.resolve({
                        size: 0
                    })
                }), e.$broadcast("markChanges", "content item has been re-sized."), f.promise
            },
            j = function(a, h, i, j) {
                var k = d.defer();
                return j = j || 0, g(a).then(function(a) {
                    if (a.parents[0].content.length >= 12 + j && "col" === a.element.type) return void k.resolve({
                        success: !1
                    });
                    var d = c.getNewElement(a.parents[0], i);
                    b.addElementOnArray(a.parents[0].content, a.index + (h ? 1 : 0), d), "col" !== d.type && "row" !== d.type || f(a.parents[0].id), k.resolve({
                        success: !0
                    })
                }), e.$broadcast("markChanges", i.type + " content item has been added."), k.promise
            },
            k = function(a) {
                var c = d.defer();
                return g(a).then(function(a) {
                    if ("page" !== a.parents[0].type && a.parents[0].id && 1 === a.parents[0].content.length) k(a.parents[0].id).then(function() {
                        c.resolve()
                    });
                    else {
                        b.deleteElementOnArray(a.parents[0].content, a.index);
                        var d = b.getClosestParent(a, "row");
                        if (b.levelOfNestedRows(a) > 1 && 1 === d.content.length && 1 === d.content[0].content.length) {
                            var g = a.parents[0].content[0].content[0];
                            l(g.id, d.id, !1)
                        }
                        f(a.parents[0].id), e.$broadcast("markChanges", "content item has been deleted."), c.resolve()
                    }
                }), c.promise
            },
            l = function(a, b, c) {
                var f = d.defer();
                return g(a).then(function(d) {
                    g(b).then(function(e) {
                        var g = !1;
                        if (e.parents.length >= 2 && d.parents.length >= 2) {
                            g = d.parents[d.parents.length - 2] === e.parents[e.parents.length - 2] && 1 === d.parents[0].content.length && 3 === d.parents.length && 2 === e.parents.length
                        }
                        j(b, c, d.element, g ? 1 : 0).then(function(b) {
                            b.success && k(a), f.resolve()
                        })
                    })
                }), e.$broadcast("markChanges", "content item has been moved."), f.promise
            },
            m = function(a, b, c) {
                var f = d.defer();
                return g(a).then(function(d) {
                    g(b).then(function(e) {
                        var g = !1;
                        if (e.parents.length >= 2 && d.parents.length >= 2) {
                            g = d.parents[d.parents.length - 2] === e.parents[e.parents.length - 2] && 1 === d.parents[0].content.length && 3 === d.parents.length && 2 === e.parents.length
                        }
                        h(b, c, d.element, g ? 1 : 0).then(function(b) {
                            b.success && k(a), f.resolve()
                        })
                    })
                }), e.$broadcast("markChanges", "content item has been moved to nested row."), f.promise
            };
        return {
            getPageData: a.getCurrentPage,
            getAvailableWidgets: c.getAvailableWidgets,
            moveElement: l,
            addElement: j,
            deleteElement: k,
            addNestedRow: h,
            moveToNestedRow: m,
            resizeElement: i
        }
    }]), angular.module("msLayoutManager").factory("LayoutServiceArrayHelper", [function() {
        var a = function(b) {
                var c = 0;
                if (b.content) {
                    var d = 0;
                    "col" === b.type && (d = 1);
                    for (var e = 0; b.content[e]; e++) {
                        var f = a(b.content[e]);
                        "col" === b.type ? d = Math.max(d, f) : d += f
                    }
                    c = d
                }
                return c
            },
            b = function(b, d, e) {
                var f = b.size,
                    g = d.size,
                    h = a(b),
                    i = a(d),
                    j = g + f,
                    k = j - i;
                return e = Math.max(e, h), e = Math.min(e, k), b.size = e, d.size = j - e, c(b, b.size, h), c(d, d.size, i), e
            },
            c = function(b, d, e) {
                if (b) {
                    var f = b.content;
                    if (f)
                        if (e || (e = a(b)), "page" === b.type)
                            for (var g = 0; f[g]; g++) c(f[g], d);
                        else if ("row" === b.type)
                        for (var h = Math.floor(d / e), i = d - h * e, j = 0; f[j]; j++) {
                            var k = a(f[j]),
                                l = k * h + Math.min(k, i);
                            i -= Math.min(k, i), f[j].size = l, c(f[j], l, e)
                        } else if ("col" === b.type)
                            for (var m = 0; f[m]; m++) "row" === f[m].type && c(f[m], d)
                }
            },
            d = function(a, b, c) {
                for (var e = 0; a[e]; e++) {
                    var f = a[e];
                    if (f[b] === c) return {
                        index: e,
                        element: f,
                        parents: []
                    };
                    if (f.content) {
                        var g = d(f.content, b, c);
                        if (g) return g.parents.push(f), g
                    }
                }
            };
        return {
            searchOnPageForElementAndParents: function(a, b, c) {
                a.content = a.pagecontentblocks, a.type = "page";
                var e;
                return e = a.content[0] ? d(a.content, b, c) : {
                    index: 0,
                    element: {
                        type: "row"
                    },
                    parents: []
                }, e && e.parents.push(a), e
            },
            addElementOnArray: function(a, b, c) {
                a.splice(b, 0, c)
            },
            deleteElementOnArray: function(a, b) {
                a.splice(b, 1)
            },
            recalculateWidths: c,
            resizeElement: b,
            levelOfNestedRows: function(a) {
                for (var b = 0, c = 0; a && a.parents && a.parents[c]; c++) "row" === a.parents[c].type && b++;
                return b
            },
            getClosestParent: function(a, b) {
                for (var c = 0; a && a.parents && a.parents[c]; c++)
                    if (a.parents[c].type === b || !b) return a.parents[c]
            }
        }
    }]), angular.module("msLayoutManager").factory("LayoutServiceFactoryHelper", [function() {
        var a = function(a) {
                for (var c = b(), d = 0; d < c.length; d++)
                    if (c[d].type === a) return c[d].name
            },
            b = function() {
                return [{
                    name: "Text",
                    icon: "",
                    type: "text"
                }, {
                    name: "Image",
                    icon: "",
                    type: "single-image"
                }, {
                    name: "Gallery",
                    icon: "",
                    type: "slide-show"
                }, {
                    name: "Social links",
                    icon: "",
                    type: "social-link"
                }, {
                    name: "Twitter",
                    icon: "",
                    type: "twitter"
                }, {
                    name: "Contact Form",
                    icon: "",
                    type: "contact-form"
                }, {
                    name: "Map",
                    icon: "",
                    type: "map"
                }, {
                    name: "Embed",
                    icon: "",
                    type: "html"
                }, {
                    name: "Spacer",
                    icon: "",
                    type: "spacer"
                }, {
                    name: "Video",
                    icon: "",
                    type: "video"
                }, {
                    name: "Divider",
                    icon: "",
                    type: "divider"
                }, {
                    name: "File",
                    icon: "",
                    type: "downloadable-file"
                }]
            },
            c = function(a) {
                return {
                    id: e(),
                    type: "col",
                    size: 12,
                    content: [a]
                }
            },
            d = function(a) {
                return {
                    id: e(),
                    type: "row",
                    size: 12,
                    content: [c(a)]
                }
            },
            e = function() {
                return "id-" + (new Date).getTime() + Math.floor(1e5 * Math.random())
            };
        return {
            getNewElement: function(a, b) {
                return b = angular.copy(b) || {}, b.id = e(), "page" === a.type ? d(b) : "row" === a.type ? c(b) : b
            },
            getAvailableWidgets: b,
            getWidgetByType: a
        }
    }]), angular.module("msContentItemsControls", ["msLayoutManager"]), angular.module("msContentItemsControls").directive("msContentItemControls", ["LayoutService", "$compile", function(a, b) {
        return {
            scope: {
                actions: "="
            },
            restrict: "A",
            link: function(c, d, e) {
                var f = c.actions.controls || [],
                    g = angular.element('<div class="element-controls ms-tools"></div>');
                c.deleteElem = function() {
                    var b = d.attr("data-id");
                    a.deleteElement(b)
                }, f.forEach(function(a) {
                    var b = angular.element("<div></div>");
                    if (b.attr("class", "element-control has-tooltip " + a), "delete icon-delete" === a) b.attr("ng-click", "deleteElem()"), b.attr("ms-tooltip", ""), b.attr("tooltip-content", "Delete");
                    else if ("handle icon-drag" === a) b.attr("ms-tooltip", ""), b.attr("tooltip-content", "Click and drag to move");
                    else {
                        if ("settings icon-settings" !== a || !c.actions.displaySettings) return;
                        b.attr("ng-click", "actions.displaySettings()"), b.attr("ms-tooltip", ""), b.attr("tooltip-content", "Settings")
                    }
                    g.append(b)
                }), b(g)(c, function(a) {
                    d.append(a)
                })
            }
        }
    }]), angular.module("msContentItemSocialShare", []), angular.module("msContentItemSocialShare").directive("msContentItemSocialShare", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = "";
                angular.forEach(b.contentItemData.settings, function(a) {
                    !0 !== a.selected && "true" !== a.selected || (d += '<a class="addthis_button_' + a.name + '"></a>')
                }), a('<div class="addthis_toolbox">' + d + '</div><script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-53f1bcdd17460bb8"><\/script>')(b, function(a) {
                    c.html(a)
                })
            }
        }
    }]), angular.module("msContentItemSocialShare").directive("msContentItemSocialShareEdit", ["$compile", "$timeout", "$sce", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = [{
                    name: "facebook",
                    selected: !0
                }, {
                    name: "twitter",
                    selected: !0
                }, {
                    name: "pinterest",
                    selected: !0
                }, {
                    name: "linkedin",
                    selected: !0
                }];
                b.contentItemData.settings && 0 !== b.contentItemData.settings.length || (b.contentItemData.settings = d);
                var e = '<a class="addthis_button_facebook at300b" title="Facebook" href="#"><span class="at16nc at300bs at15nc at15t_facebook at16t_facebook"><span class="at_a11y">Share on facebook</span></span></a>',
                    f = '<a class="addthis_button_twitter at300b" title="Tweet" href="#"><span class="at16nc at300bs at15nc at15t_twitter at16t_twitter"><span class="at_a11y">Share on twitter</span></span></a>',
                    g = '<a class="addthis_button_pinterest at300b"><span class="at_PinItButton"></span></a>',
                    h = '<a class="addthis_button_linkedin at300b" href="http://www.addthis.com/bookmark.php?v=300&amp;winname=addthis&amp;pub=ra-53f1bcdd17460bb8&amp;source=tbx-300&amp;lng=en-US&amp;s=linkedin&amp;url=http%3A%2F%2F127.0.0.1%3A9000%2F%23%2FpageBuilder%2Fhome&amp;title=MrSite&amp;ate=AT-ra-53f1bcdd17460bb8/-/-/53f2117ce3042404/3&amp;frommenu=1&amp;uid=53f2117c65916aa6&amp;ct=1&amp;uct=1&amp;tt=0&amp;captcha_provider=nucaptcha" target="_blank" title="LinkedIn"><span class="at16nc at300bs at15nc at15t_linkedin at16t_linkedin"><span class="at_a11y">Share on linkedin</span></span></a>',
                    i = "",
                    j = function() {
                        var a = "";
                        angular.forEach(b.contentItemData.settings, function(b) {
                            "facebook" !== b.name || !0 !== b.selected && "true" !== b.selected || (a += e), "twitter" !== b.name || !0 !== b.selected && "true" !== b.selected || (a += f), "pinterest" !== b.name || !0 !== b.selected && "true" !== b.selected || (a += g), "linkedin" !== b.name || !0 !== b.selected && "true" !== b.selected || (a += h)
                        }), i = '<div class="addthis_toolbox">' + a + '<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-53f1bcdd17460bb8"><\/script></div>'
                    },
                    k = function() {
                        j(), a(i)(b, function(a) {
                            c.html(a)
                        })
                    };
                b.$watch("contentItemData.settings", k, !0)
            }
        }
    }]), angular.module("msContentItemSocialShare").directive("msContentItemSocialShareSettings", ["$compile", "$sce", "$timeout", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            link: function(b, c) {
                var d = [{
                    name: "facebook",
                    selected: !0
                }, {
                    name: "twitter",
                    selected: !0
                }, {
                    name: "pinterest",
                    selected: !0
                }, {
                    name: "linkedin",
                    selected: !0
                }];
                b.settings && b.settings.length || (b.settings = d), a('<label for="{{setting.name}}" ng-repeat="setting in settings">{{setting.name}}<input type="text" id="{{setting.name}}" value="{{setting.name}}" ng-model="setting.selected"></label>')(b, function(a) {
                    c.html(a)
                })
            }
        }
    }]), angular.module("msContentItemSocialLink", []),
    function(a, b, c, d, e) {
        function f(b, c) {
            if (c) {
                var d = c.getAttribute("viewBox"),
                    e = a.createDocumentFragment(),
                    f = c.cloneNode(!0);
                for (d && b.setAttribute("viewBox", d); f.childNodes.length;) e.appendChild(f.childNodes[0]);
                b.appendChild(e)
            }
        }

        function g() {
            var b = a.createElement("x"),
                c = this.s;
            b.innerHTML = this.responseText, this.onload = function() {
                c.splice(0).map(function(a) {
                    f(a[0], b.querySelector("#" + a[1].replace(/(\W)/g, "\\$1")))
                })
            }, this.onload()
        }

        function h() {
            for (var e; e = b[0];) {
                var i = e.parentNode,
                    j = e.getAttribute("xlink:href").split("#"),
                    k = j[0],
                    j = j[1];
                i.removeChild(e), k.length ? (e = d[k] = d[k] || new XMLHttpRequest, e.s || (e.s = [], e.open("GET", k), e.onload = g, e.send()), e.s.push([i, j]), 4 === e.readyState && e.onload()) : f(i, a.getElementById(j))
            }
            c(h)
        }
        e && h()
    }(document, document.getElementsByTagName("use"), window.requestAnimationFrame || window.setTimeout, {}, /Trident\/[567]\b/.test(navigator.userAgent) || 537 > (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1]), angular.module("msContentItemSocialLink").directive("msContentItemSocialLink", ["$compile", "$window", "SiteRepository", "Config", function(a, b, c, d) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(e, f) {
                e.openSettings = e.$parent.actions.displaySettings, e.socialLinks = e.socialLinks || [], c.getSiteSettings().then(function(a) {
                    9 === a.socialLinks.length && a.socialLinks.push({
                        name: "youtube",
                        url: ""
                    }), e.contentItemData.settings.socialLinks = a.socialLinks
                }), e.contentItemData.settings.selectedStyle.id = e.contentItemData.settings.selectedStyle.name.replace(" ", "-").toLowerCase(), e.contentItemData.settings.selectedColor.id = e.contentItemData.settings.selectedColor.name.toLowerCase();
                var g = function() {
                    e.socialLinks = [], angular.forEach(e.contentItemData.settings.socialLinks, function(a) {
                        var b = "";
                        "" !== a.url && ("facebook" === a.name && (b = "//www.facebook.com/" + a.url), "twitter" === a.name && (b = "//www.twitter.com/" + a.url), "pinterest" === a.name && (b = "//www.pinterest.com/" + a.url), "googleplus" === a.name && (b = "//plus.google.com/" + a.url + "/posts"), "instagram" === a.name && (b = "//www.instagram.com/" + a.url), "linkedin" === a.name && (b = "//linkedin.com/" + a.url), "tumblr" === a.name && (b = "//" + a.url + ".tumblr.com/"), "flickr" === a.name && (b = "//flickr.com/photos/" + a.url), "email" === a.name && (b = "mailto:" + a.url), "youtube" === a.name && (b = "//www.youtube.com/" + a.url), e.socialLinks.push({
                            name: a.name,
                            url: b
                        }))
                    });
                    var b = '<div class="ms-no-settings ms-tools"><button class="ms-button primary" ng-click="openSettings()">Add your Social Links</button>';
                    e.svgUrl = function(a, b) {
                        //return b ? d.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a + "-mask" : d.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a
                        return b ? d.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a + "-mask" : d.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a
                    }, e.socialLinks.length > 0 && (b = '<ul class="{{\'icon-shape-\' + contentItemData.settings.selectedStyle.shape}} {{\'icon-color-\' + contentItemData.settings.selectedColor.id}}" ng-class="{\'icon-style-mask\': contentItemData.settings.selectedStyle.mask}"><li ng-repeat="(name, setting) in socialLinks" class="social-icon {{setting.name}}"><span ng-click="open(setting.url)" ><svg role="img" class="ms-svg-icon" viewBox="0 0 64 64"><use class="ms-use-icon standard" xlink:href="{{svgUrl(setting.name)}}"></use><use class="ms-use-icon mask" xlink:href="{{svgUrl(setting.name, true)}}"></use></svg></span></li></ul>'), a(b)(e, function(a) {
                        f.html(a)
                    })
                };
                e.open = function(a) {
                    b.open(a)
                }, g()
            }
        }
    }]), angular.module("msContentItemSocialLink").directive("msContentItemSocialLinkEdit", ["$compile", "$timeout", "$sce", "$window", "SiteRepository", "Config", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                b.openSettings = b.$parent.actions.displaySettings, b.socialLinks = b.socialLinks || [], 9 === b.socialLinks.length && b.socialLinks.push({
                    name: "youtube",
                    url: ""
                }), e.getSiteSettings().then(function(a) {
                    9 === a.socialLinks.length && a.socialLinks.push({
                        name: "youtube",
                        url: ""
                    }), b.contentItemData.settings.socialLinks = a.socialLinks
                }), b.contentItemData.settings.selectedStyle || (b.contentItemData.settings.selectedStyle = {
                    id: "standard",
                    name: "Standard",
                    shape: "standard",
                    mask: !1
                }), b.contentItemData.settings.selectedColor || (b.contentItemData.settings.selectedColor = {
                    id: "dark",
                    name: "Dark"
                });
                var g = function() {
                    b.socialLinks = [], angular.forEach(b.contentItemData.settings.socialLinks, function(a) {
                        var c = "";
                        "" !== a.url && ("facebook" === a.name && (c = "//www.facebook.com/" + a.url), "twitter" === a.name && (c = "//www.twitter.com/" + a.url), "pinterest" === a.name && (c = "//www.pinterest.com/" + a.url), "googleplus" === a.name && (c = "//plus.google.com/" + a.url + "/posts"), "instagram" === a.name && (c = "//www.instagram.com/" + a.url), "linkedin" === a.name && (c = "//linkedin.com/" + a.url), "tumblr" === a.name && (c = "//" + a.url + ".tumblr.com/"), "flickr" === a.name && (c = "//flickr.com/photos/" + a.url), "email" === a.name && (c = "mailto:" + a.url), "youtube" === a.name && (c = "//www.youtube.com/" + a.url), b.socialLinks.push({
                            name: a.name,
                            url: c
                        }))
                    });
                    var d = '<div class="ms-no-settings ms-tools"><button class="ms-button primary" ng-click="openSettings()">Add your Social Links</button>';
                    b.svgUrl = function(a, b) {
                        return b ? f.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a + "-mask" : f.GetEndPoint("modulesDirectory") + "/msContentItemSocialLink/sprites.svg#" + a
                    }, b.socialLinks.length > 0 && (d = '<ul class="{{\'icon-shape-\' + contentItemData.settings.selectedStyle.shape}} {{\'icon-color-\' + contentItemData.settings.selectedColor.id}}" ng-class="{\'icon-style-mask\': contentItemData.settings.selectedStyle.mask}"><li ng-repeat="(name, setting) in socialLinks" class="social-icon {{setting.name}}"><span ng-click="open(setting.url)" ><svg role="img" class="ms-svg-icon" viewBox="0 0 64 64"><use class="ms-use-icon standard" xlink:href="{{svgUrl(setting.name)}}"></use><use class="ms-use-icon mask" xlink:href="{{svgUrl(setting.name, true)}}"></use></svg></span></li></ul>'), a(d)(b, function(a) {
                        c.html(a)
                    })
                };
                b.open = function(a) {
                    d.open(a)
                }, b.$watch("contentItemData.settings", g, !0)
            }
        }
    }]), angular.module("msContentItemSocialLink").directive("msContentItemSocialLinkSettings", ["$compile", "$sce", "$timeout", "SiteRepository", "$rootScope", "Config", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            templateUrl: f.GetSessionStoredValue("modulesDirectory") + "/msContentItemSocialLink/SocialLinkSettings.html",
            link: function(a, b) {
                a.settings = a.settings || {}, a.socialIconStyles = [{
                    id: "standard",
                    name: "Standard",
                    shape: "standard",
                    mask: !1
                }, {
                    id: "square",
                    name: "Square",
                    shape: "square",
                    mask: !1
                }, {
                    id: "square-mask",
                    name: "Square Mask",
                    shape: "square",
                    mask: !0
                }, {
                    id: "circle",
                    name: "Circle",
                    shape: "circle",
                    mask: !1
                }, {
                    id: "circle-mask",
                    name: "Circle Mask",
                    shape: "circle",
                    mask: !0
                }], a.socialIconColors = [{
                    id: "dark",
                    name: "Dark"
                }, {
                    id: "light",
                    name: "Light"
                }, {
                    id: "standard",
                    name: "Standard"
                }];
                var c = function() {
                        if (!a.settings.selectedStyle && a.$parent.contentItemData.settings.selectedStyle)
                            for (var b = 0; b < a.socialIconStyles.length; b++)
                                if (a.socialIconStyles[b].id === a.$parent.contentItemData.settings.selectedStyle.id) {
                                    a.settings.selectedStyle = a.socialIconStyles[b];
                                    break
                                }
                    },
                    f = function() {
                        if (!a.settings.selectedColor && a.$parent.contentItemData.settings.selectedColor)
                            for (var b = 0; b < a.socialIconColors.length; b++)
                                if (a.socialIconColors[b].id === a.$parent.contentItemData.settings.selectedColor.id) {
                                    a.settings.selectedColor = a.socialIconColors[b];
                                    break
                                }
                    },
                    g = function() {
                        a.$parent.contentItemData && a.$parent.contentItemData.settings && (c(), f())
                    };
                (function() {
                    d.getSiteSettings().then(function(b) {
                        9 === b.socialLinks.length && b.socialLinks.push({
                            name: "youtube",
                            url: ""
                        }), a.settings = b, g(), a.settings.selectedStyle = a.settings.selectedStyle || a.socialIconStyles[0], a.settings.selectedColor = a.settings.selectedColor || a.socialIconColors[0]
                    })
                })(), a.$watch("settings.selectedStyle", function(b, c) {
                    a.settings.selectedStyle = b
                }), a.$watch("settings", function(b, c) {
                    c !== b && (e.$broadcast("markChanges", "social link settings has been changed."), d.updateSiteSettings(a.settings).then(function(a) {}))
                }, !0)
            }
        }
    }]), angular.module("msConfig", []), angular.module("msConfig").factory("Config", ["$http", "$window", "$location", "ConfigConstants", "$sessionStorage", function(a, b, c, d, e) {
        angular.forEach(d, function(a, b) {
            e.put(b, a)
        });
        var f = function(a) {
            return e.get(a)
        };
        return {
            GetEndPoint: function(a) {
                return d[a] || f(a)
            },
            GetSessionStoredValue: f
        }
    }]), angular.module("msRestangular", ["restangular", "msConfig"]).config(["RestangularProvider", function(a) {
        a.setDefaultHttpFields({
            cache: !1
        })
    }]), angular.module("msRestangular").factory("ApiRestangular", ["Restangular", "Config", function(a, b) {
        return a.withConfig(function(a) {
            a.setBaseUrl(b.GetEndPoint("apiEndpoint") + "shops/")
        })
    }]), angular.module("msRestangular").factory("BaseApiRestangular", ["Restangular", "Config", function(a, b) {
        return a.withConfig(function(a) {
            a.setBaseUrl(b.GetEndPoint("apiEndpoint") + "shops/")
        })
    }]), angular.module("msRestangular").factory("AppRestangular", ["Restangular", function(a) {
        return a.withConfig(function(a) {
            a.setBaseUrl("/")
        })
    }]), angular.module("msRestangular").factory("BlogRestangular", ["Restangular", "Config", "$window", "$rootScope", "$q", "RestangularManager", function(a, b, c, d, e, f) {
        return a.withConfig(function(a) {
            var c = e.defer(),
                g = !1;
            f.init(a), a.addFullRequestInterceptor(function(a, b, d, e, f, g, h) {
                return c.promise.then(function() {
                    return {}
                })
            });
            var h = function() {
                g && c.resolve()
            };
            d.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), d.$on("auth:blogIdChange", function(c, d) {
                a.setBaseUrl(b.GetEndPoint("agoraApiEndpoint") + "blogs/" + d.blogId), g = d && d.blogId, h()
            })
        })
    }]), angular.module("msRestangular").factory("BaseBlogRestangular", ["Restangular", "Config", "$window", function(a, b) {
        return a.withConfig(function(a) {
            a.setFullResponse(!0), a.setBaseUrl(b.GetEndPoint("agoraApiEndpoint") + "blogs/")
        })
    }]), angular.module("msRestangular").factory("DiscussionRestangular", ["Restangular", "Config", "$rootScope", "RestangularManager", function(a, b, c, d) {
        return a.withConfig(function(a) {
            d.init(a), c.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), a.setBaseUrl(b.GetEndPoint("agoraApiEndpoint") + "discussions/")
        })
    }]), angular.module("msRestangular").factory("GuestbookRestangular", ["Restangular", "Config", "$rootScope", "RestangularManager", function(a, b, c, d) {
        return a.withConfig(function(a) {
            d.init(a), c.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), a.setBaseUrl(b.GetEndPoint("agoraApiEndpoint") + "guestbooks/")
        })
    }]), angular.module("msRestangular").factory("IdServerRestangular", ["Restangular", "Config", "RestangularManager", function(a, b, c) {
        return a.withConfig(function(a) {
            c.init(a), a.setBaseUrl(b.GetEndPoint("idServerEndpoint"))
        })
    }]), angular.module("msRestangular").factory("MessagingRestangular", ["Restangular", "Config", "$location", "RestangularManager", function(a, b, c, d) {
        return a.withConfig(function(a) {
            d.init(a), a.setBaseUrl(b.GetEndPoint("messagingEndpoint") + "mail/")
        })
    }]), angular.module("msRestangular").factory("MetaDataRestangular", ["Restangular", "Config", "$location", "$rootScope", "RestangularManager", function(a, b, c, d, e) {
        return a.withConfig(function(a) {
            e.init(a), d.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), a.setBaseUrl(b.GetEndPoint("metaDataApiEndpoint") + "metadatas/")
        })
    }]), angular.module("msRestangular").factory("RestangularManager", ["$rootScope", "$q", function(a, b) {
        return {
            init: function(b) {
                b.setFullResponse(!0), b.setErrorInterceptor(function(b, c, d) {
                    return 401 === b.status && a.$broadcast("restangular:needLogin", {
                        response: b
                    }), !0
                })
            }
        }
    }]), angular.module("msRestangular").service("ShopRestangular", ["Restangular", "Config", "$window", "$rootScope", "$q", "RestangularManager", function(a, b, c, d, e, f) {
        return a.withConfig(function(a) {
            var c = e.defer(),
                g = !1;
            f.init(a), a.addFullRequestInterceptor(function(a, b, d, e, f, g, h) {
                return c.promise.then(function() {
                    return {}
                })
            });
            var h = function() {
                g && c.resolve()
            };
            d.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), d.$on("auth:shopIdChange", function(c, d) {
                a.setBaseUrl(b.GetEndPoint("shopApiEndpoint") + "shops/" + d.shopId), g = d && d.shopId, h()
            })
        })
    }]), angular.module("msRestangular").factory("SiteRestangular", ["Restangular", "Config", "$location", "$rootScope", "RestangularManager", function(a, b, c, d, e) {
        return a.withConfig(function(a) {
            e.init(a), d.$on("auth:tokenChange", function(b, c) {
                a.setDefaultHeaders(c.headers)
            }), d.$on("auth:siteIdChange", function(c, d) {
                d.siteId && a.setBaseUrl(b.GetEndPoint("siteApiEndpoint") + "sites/" + d.siteId)
            });
            var f = c.host();
            "127.0.0.1" !== f && "localhost" !== f || (f = "evianevian.dev.clienthost.mrsite.web");
            var g = b.GetEndPoint("subDomains");
            if (g) {
                var h = f.split(".")[0]; - 1 !== g.indexOf(h) && (f = f.replace(h + ".", ""))
            }
            a.setBaseUrl(b.GetEndPoint("siteApiEndpoint") + "sites/" + f)
        })
    }]), angular.module("msRestangular").factory("BaseSiteRestangular", ["Restangular", "Config", "RestangularManager", function(a, b, c) {
        return a.withConfig(function(a) {
            c.init(a), a.setBaseUrl(b.GetEndPoint("siteApiEndpoint") + "sites/")
        })
    }]), angular.module("msRestangular").factory("ThemeRestangular", ["Restangular", "Config", "RestangularManager", function(a, b, c) {
        return a.withConfig(function(a) {
            c.init(a), a.setBaseUrl(b.GetEndPoint("siteApiEndpoint") + "themes/")
        })
    }]), angular.module("msSiteRepository", ["msRestangular", "msConfig"]), angular.module("msSiteRepository").factory("SiteRepository", ["SiteRestangular", "BaseSiteRestangular", "$q", function(a, b, c) {
        var d, e = function() {
                var b = c.defer();
                return d = b.promise, a.one("").get().then(function(a) {
                    var c = a.data.SiteData;
                    c.images = c.images || {}, c.images.headerLogo = c.images.headerLogo || {
                        value: "",
                        themeImage: "",
                        isRemove: !1
                    }, c.images.footerLogo = c.images.footerLogo || {
                        value: "",
                        themeImage: "",
                        isRemove: !1
                    }, b.resolve(c)
                }), d
            },
            f = function() {
                var a = c.defer();
                return e().then(function(b) {
                    return a.resolve(b.siteId), d
                }), a.promise
            },
            g = function(a) {
                var d = c.defer();
                return b.all("").post(a).then(function(a) {
                    d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            h = function(b) {
                var d = c.defer();
                return b.siteData = void 0, b.SiteData = void 0, a.all("").customPUT(b).then(function(a) {
                    d.resolve(!0)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            i = function() {
                var b = c.defer();
                return a.one("settings").get().then(function(a) {
                    b.resolve(a.data.Settings)
                }), b.promise
            },
            j = function() {
                var b = c.defer();
                return a.one("").get().then(function(a) {
                    b.resolve(a.data.SiteData.extensions)
                }), b.promise
            },
            k = function() {
                var a = c.defer(),
                    b = [];
                return b.push({
                    name: "facebook",
                    url: ""
                }), b.push({
                    name: "twitter",
                    url: ""
                }), b.push({
                    name: "pinterest",
                    url: ""
                }), b.push({
                    name: "googleplus",
                    url: ""
                }), b.push({
                    name: "instagram",
                    url: ""
                }), b.push({
                    name: "linkedin",
                    url: ""
                }), b.push({
                    name: "tumblr",
                    url: ""
                }), b.push({
                    name: "flickr",
                    url: ""
                }), b.push({
                    name: "email",
                    url: ""
                }), i().then(function(c) {
                    c.socialLinks = b, l(c).then(function(b) {
                        a.resolve(c)
                    })
                }), a.promise
            },
            l = function(b) {
                var d = c.defer();
                return a.all("settings").customPUT(b).then(function(a) {
                    d.resolve(a.data)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            m = function(b) {
                var d = c.defer();
                return a.all("themes").post('"' + b + '"').then(function(a) {
                    var b = a.data.trim();
                    b = b.replace(/(^"|"$)/g, ""), d.resolve(b)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            n = function(b) {
                var d = c.defer();
                return a.one("themes/" + b).get().then(function(a) {
                    d.resolve(a.data)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            o = function() {
                var b = c.defer();
                return a.one("themes").get().then(function(a) {
                    b.resolve(a.data.Themes)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            },
            p = function(b) {
                var d = c.defer();
                return n(b).then(function(c) {
                    var e = c.Theme;
                    e.IsLive = !0, a.all("themes/" + b).customPUT(e).then(function(a) {
                        d.resolve(!0)
                    }, function(a) {
                        d.resolve(a)
                    })
                }), d.promise
            },
            q = function(b) {
                var d = c.defer();
                return a.all("themes/" + b).remove().then(function(a) {
                    d.resolve(a.data)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            r = function(b) {
                var d = c.defer();
                return a.all("contentsnapshots").post(b).then(function(a) {
                    d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            s = function() {
                var b = c.defer();
                return a.all("themes").get("updates").then(function(a) {
                    for (var c = a.data, d = [], e = 0; c[e]; e++) d.push(c[e]);
                    b.resolve(d)
                }), b.promise
            },
            t = function(b) {
                var d = c.defer();
                return a.all("themes/" + b).one("update").customPUT().then(function(a) {
                    d.resolve(a.data)
                }), d.promise
            };
        return {
            createNewPage: function(b, d) {
                var e = c.defer(),
                    f = {
                        name: b,
                        type: d
                    };
                return a.all("pages").post(f).then(function(a) {
                    e.resolve(a.data)
                }), e.promise
            },
            getSite: e,
            getSiteId: f,
            createSite: g,
            updateSite: h,
            getSiteExtensions: j,
            getSiteSettings: i,
            setDefaultSocialSettings: k,
            updateSiteSettings: l,
            getMyThemes: o,
            installTheme: m,
            setThemeToLive: p,
            deleteMyThemeById: q,
            saveContentSnapShot: r,
            getThemeUpdates: s,
            updateTheme: t
        }
    }]), angular.module("msMessagingManager", ["msRestangular", "msSiteRepository"]), angular.module("msMessagingManager").factory("MessagingManager", ["MessagingRestangular", "$q", "SiteRepository", function(a, b, c) {
        return {
            sendMessage: function(b) {
                return c.getSiteId().then(function(c) {
                    return b.siteId = c, a.all("").customPOST(b)
                })
            }
        }
    }]), angular.module("msContentItemContactForm", ["msMessagingManager", "ui.bootstrap"]), angular.module("msContentItemContactForm").directive("msContentItemContactForm", ["MessagingManager", "Config", "Helper", "$timeout", function(a, b, c, d) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msContentItemContactForm/contactForm.html",
            link: function(b, e) {
                b.defaultFormItems = [{
                    id: c.guid(),
                    type: "text",
                    label: "Name",
                    placeholder: "Enter your name",
                    required: !1
                }, {
                    id: c.guid(),
                    type: "text",
                    label: "Email",
                    placeholder: "Enter your email address",
                    required: !1
                }, {
                    id: c.guid(),
                    type: "textarea",
                    label: "Message",
                    placeholder: "Enter your message",
                    required: !1
                }], b.contentItemData.settings.toEmail = b.contentItemData.settings.toEmail || "mail@yourwebsite.com", b.contentItemData.settings.subject = b.contentItemData.settings.subject || "You have a new contact form message", b.contentItemData.settings.buttonText = b.contentItemData.settings.buttonText || "Send", b.contentItemData.settings.formItems = b.contentItemData.settings.formItems || b.defaultFormItems, b.formData = [], b.formSubmitted = !1, angular.forEach(b.contentItemData.settings.formItems, function(a) {
                    void 0 === a.id && (a.id = c.guid());
                    var d = {};
                    b.formData.push(d)
                });
                var f = e.find(".submit-button");
                b.submitForm = function(c) {
                    c.$valid ? (f.addClass("sending"), a.sendMessage({
                        to: b.contentItemData.settings.toEmail,
                        subject: b.contentItemData.settings.subject,
                        messageFields: b.formData
                    }).then(function(a) {
                        201 === a.status ? (f.removeClass("sending"), f.addClass("sent"), f.find("span").text("Your message has been sent"), d(function() {
                            f.removeClass("sent"), f.find("span").text("Send")
                        }, 2e3)) : (f.addClass("error"), f.find("span").text("There was an error sending your message"), d(function() {
                            f.find("span").text("Send"), f.removeClass("error")
                        }, 2e3))
                    })) : b.formSubmitted = !0
                }
            }
        }
    }]), angular.module("msContentItemContactForm").directive("msContentItemContactFormEdit", ["Config", "$timeout", "$compile", "Helper", "MessagingManager", function(a, b, c, d, e) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            templateUrl: a.GetSessionStoredValue("modulesDirectory") + "/msContentItemContactForm/contactForm.html",
            link: function(a, b) {
                a.formData = [], a.defaultFormItems = [{
                    id: d.guid(),
                    type: "text",
                    label: "Name",
                    placeholder: "Enter your name",
                    required: !1
                }, {
                    id: d.guid(),
                    type: "text",
                    label: "Email",
                    placeholder: "Enter your email address",
                    required: !1
                }, {
                    id: d.guid(),
                    type: "textarea",
                    label: "Message",
                    placeholder: "Enter your message",
                    required: !1
                }], a.contentItemData.settings.toEmail = a.contentItemData.settings.toEmail || "mail@yourwebsite.com", a.contentItemData.settings.subject = a.contentItemData.settings.subject || "You have a new contact form message", a.contentItemData.settings.buttonText = a.contentItemData.settings.buttonText || "Send", a.contentItemData.settings.formItems = a.contentItemData.settings.formItems || a.defaultFormItems, a.formSubmitted = !1, angular.forEach(a.contentItemData.settings.formItems, function(a) {
                    void 0 === a.id && (a.id = d.guid())
                });
                var c = function() {
                    var b = {};
                    a.formData.push(b)
                };
                angular.forEach(a.contentItemData.settings.formItems, function() {
                    c()
                }), a.$on("newFieldAdded", function() {
                    c()
                }), a.submitForm = function(b) {
                    b.$valid || (a.formSubmitted = !0)
                }
            }
        }
    }]), angular.module("msContentItemContactForm").directive("fieldDirective", ["Config", function(a) {
        return {
            restrict: "E",
            replace: !0,
            scope: {
                field: "=",
                formData: "="
            },
            link: function(b) {
                b.formData = b.formData;
                var c = function(a) {
                    var b = "";
                    return a.split(" ").forEach(function(a, c) {
                        var d = a.toLowerCase();
                        b += 0 === c ? d : d[0].toUpperCase() + d.slice(1)
                    }), b
                };
                b.setData = function() {
                    b.formData.label = b.field.label, b.field.name = c(b.field.label), "dropdown" === b.field.type ? b.formData.value = b.field.options[0] : "checkbox" === b.field.type ? b.formData.value = b.field.value : b.formData.value = ""
                }, b.$watch("field", function() {
                    b.setData()
                }, !0), b.getTemplateUrl = function() {
                    var c = a.GetSessionStoredValue("modulesDirectory") + "/msContentItemContactForm/fields/";
                    return c += b.field.type + ".tpl.html"
                }
            },
            template: '<div ng-include="getTemplateUrl()"></div>'
        }
    }]), angular.module("msContentItemContactForm").directive("msContentItemContactFormSettings", ["$compile", "$sce", "$rootScope", "Config", "$timeout", "ngDialog", "Helper", function(a, b, c, d, e, f, g) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                settings: "="
            },
            templateUrl: d.GetSessionStoredValue("modulesDirectory") + "/msContentItemContactForm/msContactFormSettings.tpl.html",
            link: function(a, b) {
                a.formFieldTypes = [{
                    type: "text",
                    label: "Text",
                    placeholder: "",
                    required: !1
                }, {
                    type: "textarea",
                    label: "Text Area",
                    placeholder: "",
                    required: !1
                }, {
                    type: "checkbox",
                    label: "Checkbox",
                    placeholder: void 0,
                    required: !1,
                    value: !1
                }, {
                    type: "radio",
                    label: "Radio",
                    placeholder: void 0,
                    required: !1,
                    options: ["Option 1", "Option 2"]
                }, {
                    type: "dropdown",
                    label: "Drop Down",
                    placeholder: void 0,
                    required: !1,
                    options: ["Option 1", "Option 2"]
                }], a.settings = a.settings || {}, a.settings.buttonText = a.settings.buttonText || "Send", a.settings.toEmail = a.settings.toEmail || "mail@yourwebsite.com", a.settings.subject = a.settings.subject || "You have a new contact form message", a.settings.formItems = a.settings.formItems;
                var h = function(b) {
                    var c = [];
                    angular.forEach(b, function(b) {
                        angular.forEach(a.settings.formItems, function(a) {
                            a.id === b && c.push(a)
                        })
                    }), a.settings.formItems = [], a.settings.formItems = c, a.$apply()
                };
                e(function() {
                    $("ul.field-items", b).sortable({
                        items: "> li",
                        handle: ".basic-info .actions .icon-reorder",
                        axis: "y",
                        containment: "parent",
                        stop: function(a, b) {
                            var c = $(this).sortable("toArray", "id");
                            h(c)
                        }
                    })
                }, 100), a.showNewItems = function() {
                    f.open({
                        template: d.GetSessionStoredValue("modulesDirectory") + "/msContentItemContactForm/newFieldPopUp.tpl.html",
                        scope: a,
                        className: "add-form-item"
                    })
                }, a.addFormItem = function(b) {
                    var d = angular.copy(b);
                    d.id = g.guid(), a.settings.formItems.push(d), c.$broadcast("newFieldAdded"), c.$broadcast("repositionSettings")
                }, a.deleteField = function(b) {
                    a.settings.formItems.splice(b, 1)
                }, a.showSettings = function(a) {
                    $(a.target).parents(".field-item").siblings().children(".field-settings").slideUp(), $(a.target).parents().siblings(".field-settings").slideToggle()
                }
            }
        }
    }]), angular.module("msContentItemTwitter", []), angular.module("msContentItemTwitter").directive("msContentItemTwitter", ["$compile", "$timeout", "$interval", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(d, e) {
                var f = function(a, c, d) {
                        if (a.getElementById(d)) {
                            var e = a.getElementById(d);
                            e.parentElement.removeChild(e)
                        }
                        b(function() {
                            var b, e = a.getElementsByTagName(c)[0],
                                f = /^http:/.test(a.location) ? "http" : "https";
                            a.getElementById(d) || (b = a.createElement(c), b.id = d, b.src = f + "://platform.twitter.com/widgets.js", e.parentNode.insertBefore(b, e))
                        })
                    },
                    g = function(b) {
                        var g = "";
                        g = b ? '<a class="twitter-timeline" data-widget-id="' + b + '"></a>' : "", a(g)(d, function(a) {
                            e.html(a), f(document, "script", "twitter-wjs")
                        }), c(function() {
                            e.find("iframe").css({
                                "max-width": "100%",
                                width: "100%"
                            })
                        }, 100, 20)
                    },
                    h = _.debounce(g, 500),
                    i = !0,
                    j = function(a) {
                        i ? (i = !1, g(a)) : h(a)
                    };
                d.$watch("contentItemData.settings.widgetId", j)
            }
        }
    }]), angular.module("msContentItemTwitter").directive("msContentItemTwitterEdit", ["$compile", "$timeout", "$interval", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(d, e) {
                d.openSettings = d.$parent.actions.displaySettings;
                var f = function(a, c, d) {
                        if (a.getElementById(d)) {
                            var e = a.getElementById(d);
                            e.parentElement.removeChild(e)
                        }
                        b(function() {
                            var b, e = a.getElementsByTagName(c)[0],
                                f = /^http:/.test(a.location) ? "http" : "https";
                            a.getElementById(d) || (b = a.createElement(c), b.id = d, b.src = f + "://platform.twitter.com/widgets.js", e.parentNode.insertBefore(b, e))
                        })
                    },
                    g = function(b) {
                        var g = "";
                        g = b ? '<a class="twitter-timeline" data-widget-id="' + b + '"></a>' : '<div class="ms-no-settings ms-tools"><button class="ms-button primary" ng-click="openSettings()">Add your Twitter feed</button>', a(g)(d, function(a) {
                            e.html(a), f(document, "script", "twitter-wjs")
                        }), c(function() {
                            e.find("iframe").css({
                                "max-width": "100%",
                                width: "100%"
                            })
                        }, 100, 20)
                    },
                    h = _.debounce(g, 500),
                    i = !0,
                    j = function(a) {
                        i ? (i = !1, g(a)) : h(a)
                    };
                d.$watch("contentItemData.settings.widgetId", j)
            }
        }
    }]), angular.module("msContentItemTwitter").directive("msContentItemTwitterSettings", ["$compile", "$sce", "$rootScope", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><p>Click on the button below to go to Twitter. In the \'Username\' box, type in your Twitter username, then click on \'Create widget\'. Copy the long piece of code below the \u2018Preview\u2019 box  and paste it into the \u2018Twitter code\u2019 box below.</p></div><div class="col-fix14"><a target="_blank" href="https://twitter.com/settings/widgets/new" class="ms-button info">Click here to get your twitter code</a></div><div class="col-fix14"><label>Twitter code</label><input type="text" ng-model="settings.embeded"/></div></div>',
            link: function(a) {
                a.settings = a.settings || {}, a.settings.embeded = a.settings.embeded || "", a.settings.widgetId = a.settings.widgetId || "", a.$watch("settings.embeded", function() {
                    var b = a.settings.embeded.split('widget-id="');
                    if (a.settings.widgetId = a.settings.embeded, b[1]) {
                        var c = b[1].split('"');
                        c[0] && (a.settings.widgetId = c[0])
                    }
                }), a.$watch("settings", function(a, b) {
                    a !== b && c.$broadcast("markChanges", "twitter settings has been changed.")
                }, !0)
            }
        }
    }]), angular.module("msCkEditor", []), angular.module("msCkEditor").directive("ckInline", ["$compile", "$sce", function(a, b) {
        return {
            scope: {
                editorContent: "="
            },
            restrict: "AE",
            link: function(a, b, c) {
                var d = {};
                void 0 !== c.ckplaceholder && (d.placeholder = c.ckplaceholder);
                var e = CKEDITOR.inline(b[0], d),
                    f = a.$watch("editorContent", function(a) {
                        a && setTimeout(function() {
                            e.setData(a)
                        })
                    });
                e.on("change", function() {
                    a.$apply(function() {
                        a.editorContent = e.getData(), a.editorContent && f()
                    })
                })
            }
        }
    }]), angular.module("msCkEditor").directive("ckStandard", ["$compile", "$sce", function(a, b) {
        return {
            scope: {
                editorContent: "="
            },
            restrict: "AE",
            link: function(a, b, c) {
                var d = {};
                void 0 !== c.ckplaceholder && (d.placeholder = c.ckplaceholder);
                var e = CKEDITOR.replace(b[0], d),
                    f = a.$watch("editorContent", function(a) {
                        a && setTimeout(function() {
                            e.setData(a)
                        })
                    });
                e.on("change", function() {
                    a.$apply(function() {
                        a.editorContent = e.getData(), a.editorContent && f()
                    })
                })
            }
        }
    }]), angular.module("msContentItemText", ["msCkEditor"]), angular.module("msContentItemText").directive("msContentItemText", ["$sce", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            template: '<div style="color:{{contentItemData.settings.fontcolor}};background-color:{{contentItemData.settings.backgroundcolor}};line-height:{{contentItemData.settings.lineHeight}}" ng-bind-html="trustedHTML"></div>',
            link: function(b) {
                b.contentItemData.value = b.contentItemData.value || "";
                var c = b.contentItemData.value;
                0 !== b.contentItemData.value.indexOf("<p>") && (c = "<p>" + c + "</p>"), b.trustedHTML = a.trustAsHtml(c)
            }
        }
    }]), angular.module("msContentItemText").directive("msContentItemTextEdit", ["$rootScope", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            template: '<div style="color:{{contentItemData.settings.fontcolor}};background-color:{{contentItemData.settings.backgroundcolor}};line-height:{{contentItemData.settings.lineHeight}}"><div ck-inline editor-content="contentItemData.value" contenteditable="true"></div></div>',
            link: function(b) {
                b.contentItemData.value = b.contentItemData.value || "", b.$watch("contentItemData.value", function(b, c) {
                    b !== c && a.$broadcast("markChanges", "text has been changed.")
                })
            }
        }
    }]), angular.module("msContentItemText").directive("msContentItemTextSettings1", ["$compile", "$sce", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div>Font color: <input type="text" ng-model="settings.fontcolor"/>Background color: <input type="text" ng-model="settings.backgroundcolor"/>Line height: <input type="range"step="0.1" min="0.1" max="5" ng-model="settings.lineHeight"/></div>',
            link: function(a) {
                a.settings = a.settings || {}, a.settings.fontcolor = a.settings.fontcolor || "", a.settings.backgroundcolor = a.settings.backgroundcolor || "", a.settings.lineHeight = a.settings.lineHeight || ""
            }
        }
    }]), angular.module("msPageRepository", ["msSiteRepository"]), angular.module("msPageRepository").factory("PageRepository", ["SiteRepository", "$q", function(a, b) {
        var c, d = a.getSite,
            e = function() {
                var a = b.defer();
                return d().then(function(b) {
                    a.resolve(b.pages)
                }), a.promise
            };
        return {
            getCurrentPage: function() {
                var a = b.defer();
                return a.resolve(c), a.promise
            },
            setCurrentPage: function(a) {
                var e = b.defer();
                return d().then(function(b) {
                    c = b.pages.filter(function(b) {
                        return String(b.url).substring(1).toLowerCase() === a
                    })[0], c || (c = {
                        name: "404",
                        url: "/404"
                    }, "admin" === a && (c = {
                        name: "403",
                        url: "/403"
                    })), e.resolve(c)
                }), e.promise
            },
            getPages: e
        }
    }]), angular.module("msContentItemNavigation", ["msPageRepository"]), angular.module("msContentItemNavigation").directive("msContentItemNavigation", ["SiteRepository", "Config", "$timeout", "$rootScope", "MenuRepository", "PageBuilderManager", "Helper", "$q", function(a, b, c, d, e, f, g, h) {
        return {
            restrict: "A",
            replace: !0,
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msContentItemNavigation/msContentItemNavigation.tpl.html",
            link: function(a, c) {
                a.shopUrl = void 0, a.svgUrl = function(a) {
                    return b.GetEndPoint("modulesDirectory") + "/msContentItemNavigation/sprites.svg#" + a
                }, e.getMenu().then(function(b) {
                    a.menu = b, f.getPages().then(function(b) {
                        a.pages = b, g(), h(a.menu)
                    })
                }), f.getWebsiteData().then(function(b) {
                    a.isShopEnable = b.isShopEnable || !1
                });
                var g = function() {
                        for (var b = 0; b < a.pages.length; b++) {
                            var c = a.pages[b];
                            if ("shop" === c.type.toLowerCase()) {
                                a.shopUrl = c.url;
                                break
                            }
                        }
                    },
                    h = function(b) {
                        for (var c = 0; c < b.length; c++) {
                            var d = b[c];
                            "category" === d.type.toLowerCase() && (void 0 === a.shopUrl && (d.hideInMenu = !0), d.fakeUrl = "/" + d.categories.join("/")), d.hasOwnProperty("subMenuItems") && h(d.subMenuItems)
                        }
                    },
                    i = c.find(".mobile-menu"),
                    j = c.find(".mobile-menu-close"),
                    k = angular.element("body");
                i.on("click", function() {
                    c.addClass("open"), k.addClass("menu-open"), k.css({
                        overflow: "hidden"
                    })
                }), j.on("click", function() {
                    c.removeClass("open"), k.removeClass("menu-open"), k.css({
                        overflow: "visible"
                    })
                });
                c.find("ul.nav");
                a.linkClicked = function() {
                    c.removeClass("open"), k.removeClass("menu-open"), k.css({
                        overflow: "visible"
                    })
                }, d.$on("menuChanged", function() {
                    e.getMenu().then(function(b) {
                        a.menu = b, g()
                    })
                })
            }
        }
    }]), angular.module("msContentItemMap", []), angular.module("msContentItemMap").directive("msContentItemMap", ["$compile", "msContentItemMapManager", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(c, d) {
                c.openSettings = c.$parent.actions.displaySettings, c.contentItemData.settings = b.resetSettings(c.contentItemData.settings);
                var e = b.getMapIframe(c.contentItemData.settings);
                a(e)(c, function(a) {
                    d.html(a)
                })
            }
        }
    }]), angular.module("msContentItemMap").directive("msContentItemMapEdit", ["$compile", "msContentItemMapManager", "$timeout", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(d, e) {
                d.openSettings = d.$parent.actions.displaySettings, d.contentItemData.settings = b.resetSettings(d.contentItemData.settings);
                var f = function() {
                        if (d.contentItemData.settings.place) {
                            var c = b.getMapIframe(d.contentItemData.settings);
                            a(c)(d, function(a) {
                                e.html(a)
                            })
                        }
                    },
                    g = _.debounce(function() {
                        f(), d.$apply()
                    }, 1e3),
                    h = !0,
                    i = function() {
                        h ? c(function() {
                            h = !1
                        }) : d.contentItemData.settings.place && g()
                    };
                d.$watch("contentItemData.settings.apiKey", i), d.$watch("contentItemData.settings.place", i), d.$watch("contentItemData.settings.height", i), f()
            }
        }
    }]), angular.module("msContentItemMap").factory("msContentItemMapManager", [function() {
        var a = function(a) {
            return a = a || {}, a.place = a.place || "mrsite", a.height = a.height || "450", a
        };
        return {
            resetSettings: a,
            getMapIframe: function(b) {
                return b = b || a(b), '<iframe width="100%" height="{{contentItemData.settings.height}}" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=' + b.place + '&key=AIzaSyDHzR_F3yvth5q1FGwQfcqmNb0cRwwO6po"></iframe>'
            }
        }
    }]), angular.module("msContentItemMap").directive("msContentItemMapSettings", ["$compile", "msContentItemMapManager", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Address</label><input type="text" ng-model="settings.place" /></div></div><div class="row-fix"><div class="col-fix14"><label>Height</label><div class="slider"></div></div></div></div>',
            link: function(a, c) {
                $(".slider", c).slider({
                    min: 50,
                    max: 800,
                    range: "min",
                    value: a.settings.height,
                    slide: function(b, c) {
                        a.settings.height = c.value, a.$apply()
                    }
                }), a.settings = b.resetSettings(a.settings)
            }
        }
    }]), angular.module("msContentItemHtml", []), angular.module("msContentItemHtml").directive("msContentItemHtml", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = "";
                b.contentItemData.settings.htmlCode && (d = b.contentItemData.settings.htmlCode), a(d)(b, function(a) {
                    c.html(a)
                })
            }
        }
    }]), angular.module("msContentItemHtml").directive("msContentItemHtmlEdit", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = function(d) {
                    var e = '<div class="ms-no-settings">Embed means you can insert media from other websites.</div>';
                    b.contentItemData.settings.htmlCode && (e = b.contentItemData.settings.htmlCode), a(e)(b, function(a) {
                        c.html(a)
                    })
                };
                d(b.contentItemData.settings.htmlCode), b.$watch("contentItemData.settings.htmlCode", function(a, c) {
                    d(b.contentItemData.settings.htmlCode)
                })
            }
        }
    }]), angular.module("msContentItemHtml").directive("msContentItemHtmlSettings", ["$compile", "$rootScope", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Embed Code</label></div></div><div class="row-fix"><div class="col-fix14"><textarea rows="10" cols="100"  ng-model="settings.htmlCode"/></div></div></div>',
            link: function(a) {
                a.$watch("settings", function(a, c) {
                    a !== c && b.$broadcast("markChanges", "html settings has been changed.")
                }, !0)
            }
        }
    }]), angular.module("msUpload", ["blueimp.fileupload"]), angular.module("msUpload").directive("msUpload", ["$timeout", "$sce", "$window", "$compile", "Config", "$rootScope", "$sessionStorage", function(a, b, c, d, e, f, g) {
        return {
            restrict: "A",
            replace: !1,
            scope: {
                files: "=msUpload",
                title: "@msTitle",
                enableMultiple: "=msEnableMultiple",
                uploadStyle: "@msUploadStyle",
                buttonText: "@msButtonText",
                fileType: "@msFileType"
            },
            link: function(b, c) {
                b.fileLoadingError = !1, b.fileLoadingErrorMessage = "Your file is too big - please resize it.";
                var d = {
                    Authorization: "Bearer " + g.get("token")
                };
                b.$on("fileuploadadd", function(a, c) {
                    c.headers = d, c.url = e.GetEndPoint("mediaApiEndpoint") + "sites/" + g.get("siteId") + "/" + b.fileType, c.context = {
                        find: function(a) {
                            return {
                                button: function(a) {}
                            }
                        }
                    }, b.$parent.fileLoadingClass = !0, b.$parent.fileLoadingError = !1
                });
                var h;
                b.$on("fileuploadstop", function() {
                    b.$parent.fileLoadingClass = !1
                }), b.$on("fileuploadfail", function(a, c) {
                    b.fileLoadingErrorMessage = c.errorThrown;
                    var d = c.result;
                    d && d.message && (b.fileLoadingErrorMessage = d.message), b.fileLoadingError = !0
                }), b.$on("fileuploaddragover", function() {
                    a(function() {
                        b.$parent.fileDragOverClass = "file-drag-over"
                    }), a.cancel(h), h = a(function() {
                        b.$parent.fileDragOverClass = !1
                    }, 100)
                }), b.$on("fileuploaddrop", function() {
                    b.$parent.fileDragOverClass = !1
                }), b.$on("fileuploaddone", function(a, c) {
                    var d = c._response.result,
                        e = 0;
                    if (b.files = b.files || [], 5 !== b.files.length)
                        for (b.files = []; d[e];) b.files[e] = {
                            url: d[e].location
                        }, e++;
                    else
                        for (; d[e];) {
                            if (5 === b.files.length) {
                                for (var g = 0; g < b.files.length; g++)
                                    if (!b.files[g] || !b.files[g].url) {
                                        b.files[g] = {
                                            url: d[e].location
                                        };
                                        break
                                    }
                            } else if (b.files.length > 0) {
                                for (var h = 0; h < b.files.length; h++)
                                    if (!b.files[h] || !b.files[h].url) {
                                        b.files[h] = {
                                            url: d[h].location
                                        };
                                        break
                                    }
                            } else b.files.push({
                                url: d[e].location
                            });
                            e++
                        }
                    f.$broadcast("modalClose")
                }), b.clickUploadButton = function(a) {
                    var b = angular.element(a.currentTarget),
                        c = b.parent();
                    $(".image-upload", c).click()
                }, void 0 !== b.files && (0 !== b.files.length && b.files[0].url || a(function() {
                    c.find(".upload-wrap").addClass("no-images")
                }, 200)), $(document).bind("dragover", function(a) {
                    var b = $(".dropZone"),
                        c = window.dropZoneTimeout;
                    c ? clearTimeout(c) : b.addClass("in");
                    var d = !1,
                        e = a.target;
                    do {
                        if (e === b[0]) {
                            d = !0;
                            break
                        }
                        e = e.parentNode
                    } while (null !== e);
                    d ? b.addClass("hover") : b.removeClass("hover"), window.dropZoneTimeout = setTimeout(function() {
                        window.dropZoneTimeout = null, b.removeClass("in hover")
                    }, 100)
                }), b.getTemplate = function() {
                    return b.enableMultiple ? "bower_components/msUpload/moduleUpload" + b.uploadStyle + "-multiple.html" : "bower_components/msUpload/moduleUpload" + b.uploadStyle + "-single.html"
                }
            },
            template: '<div class="upload-wrap" ng-include="getTemplate()"></div>'
        }
    }]), angular.module("msMediaLibrary", ["msUpload"]), angular.module("msMediaLibrary").directive("msMediaLibrary", ["$compile", "$rootScope", "MediaLibraryManager", function(a, b, c) {
        return {
            restrict: "E",
            scope: {
                title: "=",
                uploadedFiles: "=",
                editableId: "=",
                multipleUpload: "=",
                mode: "=",
                buttonText: "@buttonText",
                fileType: "@fileType"
            },
            link: function(c, d) {
                c.buttonText = c.buttonText || "+", c.fileType = c.fileType || "files", c.$watch("uploadedFiles", function(a, c) {
                    a !== c && b.$broadcast("modalClose")
                }, !0), d.addClass("ms-tools clearfix");
                var e = "";
                "dialog" === c.mode ? e = '<div class="align-center upload-box dropZone" ng-class="{loading : fileLoadingClass}"><div ms-upload="uploadedFiles" ms-button-text="{{buttonText}}" ms-upload-style="{{mode}}" ms-title="{{title}}"  ms-enable-multiple=multipleUpload ms-file-type="{{fileType}}"></div></div>' : "hover" === c.mode ? (d.addClass("media-wrap"), d.parent().css({
                    position: "relative"
                }), e = '<div ms-upload="uploadedFiles" ng-class="{loading : fileLoadingClass}" ms-button-text="{{buttonText}}" ms-upload-style="{{mode}}" ms-title="{{title}}"  ms-enable-multiple=multipleUpload class="ms-media-library {{mode}}" ms-file-type="{{fileType}}"></div>') : e = '<div ms-upload="uploadedFiles" ng-class="{loading : fileLoadingClass}" ms-button-text="{{buttonText}}" ms-upload-style="{{mode}}" ms-title="{{title}}"  ms-enable-multiple=multipleUpload class="ms-media-library {{mode}}" ms-file-type="{{fileType}}"></div>', a(e)(c, function(a) {
                    d.html(a)
                })
            }
        }
    }]), angular.module("msMediaLibrary").factory("MediaLibraryManager", ["$q", function(a) {
        var b = {};
        return {
            setActiveFile: function(a, c) {
                b = {
                    editableId: a,
                    file: c
                }
            },
            getSelectedFile: function() {
                var c = a.defer();
                return setTimeout(function() {
                    c.resolve(b)
                }, 2e3), c.promise
            },
            loadFiles: function() {
                return 1
            },
            randomString: function() {
                for (var a = [], b = "0123456789abcdef", c = 0; c < 36; c++) a[c] = b.substr(Math.floor(16 * Math.random()), 1);
                return a[14] = "4", a[19] = b.substr(a[19] && 3 || 8, 1), a[8] = a[13] = a[18] = a[23] = "-", a.join("")
            }
        }
    }]), angular.module("msContentItemSingleImage", ["msMediaLibrary"]), angular.module("msContentItemSingleImage").directive("msContentItemSingleImage", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = "";
                if (b.contentItemData.settings.imageUrl)
                    if (b.contentItemData.settings.linkUrl) {
                        var e = new RegExp("https*://");
                        b.contentItemData.settings.linkUrl.replace(e, "").length > 0 && (d = '<div><a ng-href="{{contentItemData.settings.linkUrl}}" target="{{contentItemData.settings.imageTarget}}"><img title="{{contentItemData.settings.title}}" alt="{{contentItemData.settings.alt}}" ng-src="{{contentItemData.settings.imageUrl}}" /><div class="caption" ng-if="contentItemData.settings.caption">{{contentItemData.settings.caption}}</div></a></div>')
                    } else d = '<div><img title="{{contentItemData.settings.title}}" alt="{{contentItemData.settings.alt}}" ng-src="{{contentItemData.settings.imageUrl}}" /><div class="caption" ng-if="contentItemData.settings.caption">{{contentItemData.settings.caption}}</div></div>';
                a(d)(b, function(a) {
                    c.html(a)
                })
            }
        }
    }]), angular.module("msContentItemSingleImage").directive("msContentItemSingleImageEdit", ["$compile", "MediaLibraryManager", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(c, d) {
                var e = function() {
                    var e = '<ms-media-library mode="\'dialog\'" editable-id="editableId" uploaded-files="images" title=modalTitle multiple-upload=false></ms-media-library>';
                    if (c.contentItemData.settings.imageUrl)
                        if (c.contentItemData.settings.linkUrl) {
                            var f = new RegExp("https*://");
                            c.contentItemData.settings.linkUrl.replace(f, "").length > 0 && (e = '<div><a ng-href="{{contentItemData.settings.linkUrl}}" target="{{contentItemData.settings.imageTarget}}"><img title="{{contentItemData.settings.title}}" alt="{{contentItemData.settings.alt}}" ng-src="{{contentItemData.settings.imageUrl}}" /><div class="caption" ng-if="contentItemData.settings.caption">{{contentItemData.settings.caption}}</div></a></div>')
                        } else e = '<div><img title="{{contentItemData.settings.title}}" alt="{{contentItemData.settings.alt}}" ng-src="{{contentItemData.settings.imageUrl}}" /><div class="caption" ng-if="contentItemData.settings.caption">{{contentItemData.settings.caption}}</div></div>';
                    else c.images = [], c.images.push({
                        url: c.contentItemData.settings.imageUrl,
                        default: 0
                    }), c.editableId = b.randomString(), c.modalTitle = "Single image", c.$watch("images", function() {
                        c.contentItemData.settings.imageUrl = c.images[0].url
                    });
                    a(e)(c, function(a) {
                        d.html(a)
                    })
                };
                c.$watch("contentItemData", function() {
                    e()
                }, !0)
            }
        }
    }]), angular.module("msContentItemSingleImage").directive("msContentItemSingleImageSettings", ["$compile", "$sce", "MediaLibraryManager", "$rootScope", function(a, b, c, d) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><div class="image-wrap"><img ng-if="settings.imageUrl" title="{{settings.title}}" alt="{{settings.alt}}" ng-src="{{settings.imageUrl}}"/><ms-media-library mode="\'dialog\'" editable-id="editableId" uploaded-files="images" title=modalTitle multiple-upload=false></ms-media-library></div></div></div><div class="row-fix"><div class="col-fix7"><label>Alt</label><input type="text" ng-model="settings.alt" /></div><div class="col-fix7"><label>Title</label><input type="text" ng-model="settings.title" /></div></div><div class="row-fix"><div class="col-fix7"><label>Link URL</label><input type="url" class="link-url" ng-model="settings.linkUrl" /></div><div class="col-fix7"><label>Link Target</label><select ng-options="target.value as target.label for target in linkTarget" ng-model="settings.imageTarget"></select></div></div><div class="row-fix"><div class="col-fix14"><label>Caption</label><textarea rows="4" ng-model="settings.caption"></textarea></div></div></div>',
            link: function(a, b) {
                a.settings.alt = a.settings.alt || "", a.settings.title = a.settings.title || "", a.settings.imageUrl = a.settings.imageUrl || "", a.settings.linkUrl = a.settings.linkUrl || "", a.settings.caption = a.settings.caption || "", a.images = [], a.images.push({
                    url: a.settings.imageUrl,
                    default: 0
                }), a.editableId = c.randomString(), a.modalTitle = "Single image", a.linkTarget = [{
                    value: "_self",
                    label: "Same tab"
                }, {
                    value: "_blank",
                    label: "New tab"
                }], a.settings.imageTarget = a.settings.imageTarget || a.linkTarget[1].value, a.$watch("images", function(b, c) {
                    a.settings.imageUrl = a.images[0].url
                }), a.$watch("settings", function(a, b) {
                    a !== b && d.$broadcast("markChanges", "single image settings has been changed.")
                }, !0);
                var e = b.find("input.link-url");
                e.on("focus", function() {
                    $(this).select()
                }), e.on("blur", function() {
                    0 !== e.val().indexOf("http://") && 0 !== e.val().indexOf("https://") && (a.settings.linkUrl = "http://" + e.val())
                })
            }
        }
    }]), angular.module("msLightbox", []), angular.module("msLightbox").provider("msLightbox", function() {
        this.$get = ["$timeout", "$window", "$document", "Config", function(a, b, c, d) {
            var e, f = angular.element,
                g = c.find("body"),
                h = f('<div class="gallery-popup-wrapper"></div>'),
                i = f('<div class="popup-control prev"></div>'),
                j = f('<div class="popup-control next"></div>'),
                k = f('<div class="close-popup"></div>'),
                l = 0,
                m = {
                    checkforCss: function() {
                        var a = d.GetEndPoint("modulesDirectory") + "/msLightbox/lightbox.css";
                        $('link[href="' + a + '"]').length || $("head").append('<link href="' + a + '" type="text/css" rel="stylesheet" />')
                    }
                },
                n = {
                    items: [],
                    index: 0,
                    textPosition: "right"
                },
                o = {
                    open: function(c) {
                        c || (c = n), m.checkforCss(), e = c.items, h.append(k), k.on("click", function() {
                            o.close()
                        }), j.on("click", function() {
                            o.changeItem($(this).data("toImage"), c.position)
                        }), i.on("click", function() {
                            o.changeItem($(this).data("toImage"), c.position)
                        }), e.length > 1 && h.append(i, j), h.append(o.addItem(c.items[c.index], c.position)), h.css({
                            top: b.pageYOffset
                        }), g.append(h).css({
                            overflow: "hidden",
                            "min-height": "100%",
                            height: "100%"
                        }), a(function() {
                            h.addClass("open")
                        }, 100), l = c.index, o.setData()
                    },
                    addItem: function(a, b) {
                        var c;
                        c = a.image ? a.image : a;
                        var d = a.caption,
                            e = a.description,
                            g = f('<div class="gallery-popup"><div class="image"><img src="' + c + '"/></div></div>');
                        return d || e ? ("right" === b ? g.addClass("text-right") : "below" === b && g.addClass("text-bottom"), d && e ? g.append('<div class="info"><h2>' + d + "</h2><p>" + e + "</p></div>") : d && !e ? g.append('<div class="info"><h2>' + d + "</h2></div>") : !d && e && g.append('<div class="info"><p>' + e + "</p></div>")) : g.addClass("no-text"), g
                    },
                    close: function() {
                        var b = g.find(".gallery-popup-wrapper");
                        b.removeClass("open"), a(function() {
                            b.remove(), g.removeAttr("style"), h.html("")
                        }, 500)
                    },
                    setData: function() {
                        var a = function() {
                                return l === e.length - 1 ? "end" : l + 1
                            },
                            b = function() {
                                return 0 === l ? "end" : l - 1
                            };
                        j.data("to-image", a()).attr("data-to-image", a()), i.data("to-image", b()).attr("data-to-image", b())
                    },
                    changeItem: function(a, b) {
                        if ("end" !== a) {
                            h.find(".gallery-popup").fadeOut(function() {
                                $(this).remove()
                            }), h.append(o.addItem(e[a], b).hide().fadeIn()), l = a, o.setData()
                        }
                    }
                };
            return o
        }]
    }), angular.module("msContentItemSlideShow", ["msMediaLibrary", "ui.bootstrap", "msContentItemSingleImage", "msLightbox"]), angular.module("msContentItemSlideShow").directive("msImageSettings", ["$compile", "$sce", function(a, b) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                settings: "="
            },
            link: function(b, c) {
                b.backupSettings = angular.copy(b.settings), b.settings.caption = b.settings.caption || "", b.settings.description = b.settings.description || "";
                var d = (c.parent(), c.find(".image"), $("body").find(".imageSettingsPlaceHolder")),
                    e = $("body").find(".settingsOverlay"),
                    f = function() {
                        d.removeClass("active image-settings"), e.removeClass("active").removeAttr("style"), c.find(".ms-block").removeClass("active"), d.removeAttr("style"), $("body").removeClass("ov-hidden"), $(".image-settings", ".image-wrap").remove(), $(".images, .upload-box").show()
                    };
                b.ok = function() {
                    d.removeClass("active image-settings"), f()
                }, e.on("click", function() {
                    b.ok()
                }), b.displaySettings = function() {
                    var c = '<div class="buttons"><div class="ms-buttons"><button ng-click="ok()" class="ms-button info">Done</button></div></div>',
                        d = '<div class="image-settings"><h2 class="title">Image settings</h2><div class="wrapper"><div class="settings-mask"><div class="row-fix"><div class="col-fix13"><label>Title</label><input type="text" value="settings.caption" ng-model="settings.caption" /></div><div class="col-fix13"><label>Description</label><textarea value="settings.description" ng-model="settings.description" ng-maxlength="250"></textarea></div></div></div>' + c + "</div></div>",
                        e = angular.element(d);
                    $("body").find(".ms-block").removeClass("active"), a(e)(b, function(a) {
                        $(".image-wrap.slide-show").append(a), $("body").addClass("ov-hidden"), $(".images, .upload-box").hide()
                    })
                };
                var g = function() {
                    var d = angular.element('<span ng-click="displaySettings()" class="settings icon-settings control"></span>');
                    d.attr("ms-tooltip", ""), d.attr("tooltip-content", "Settings"), a(d)(b, function(a) {
                        c.append(a)
                    })
                };
                b.$watch("settings", function() {
                    g()
                })
            }
        }
    }]), angular.module("msContentItemSlideShow").directive("msContentItemSlideShow", ["$compile", "$timeout", "Config", "MediaLibraryManager", "msLightbox", function(a, b, c, d, e) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(a, f) {
                a.editableId = d.randomString(), a.openSettings = a.$parent.actions.displaySettings, a.contentItemData.settings.images = a.contentItemData.settings.images || [];
                var g = function() {
                    a.contentItemData.settings.selectedType = a.contentItemData.settings.selectedType || {
                        id: "slideshow",
                        name: "Slideshow"
                    }, a.contentItemData.settings.textPosition = a.contentItemData.settings.textPosition || {
                        id: "right",
                        name: "Right"
                    }, a.contentItemData.settings.height = a.contentItemData.settings.height || 300, a.contentItemData.settings.interval = a.contentItemData.settings.interval || 5e3, a.contentItemData.settings.itemsPerRow = a.contentItemData.settings.itemsPerRow || 3, a.contentItemData.settings.showCaptionsInGrid = a.contentItemData.settings.showCaptionsInGrid || !1, a.contentItemData.settings.cropImages = a.contentItemData.settings.cropImages || !1;
                    var d = a.slides = [];
                    if (a.addSlide = function(a) {
                            d.push({
                                image: a.url,
                                caption: a.caption,
                                description: a.description
                            })
                        }, a.getGalleryTemplate = function() {
                            if (a.contentItemData.settings.images.length > 0) return c.GetEndPoint("modulesDirectory") + "/msContentItemSlideShow/gallery." + a.contentItemData.settings.selectedType.id + ".tpl.html"
                        }, "slideshow" === a.contentItemData.settings.selectedType.id) {
                        var e = function() {
                            b(function() {
                                $(".carousel-control, .carousel-indicators").hide()
                            })
                        };
                        a.contentItemData.settings.showControls || e()
                    } else "grid" === a.contentItemData.settings.selectedType.id && (a.itemsPerRowClass = "items-per-row-" + a.contentItemData.settings.itemsPerRow);
                    a.contentItemData.settings.images.length > 0 ? a.contentItemData.settings.images.forEach(function(b) {
                        a.addSlide(b)
                    }) : b(function() {
                        a.contentItemData.settings.opened || (angular.element("#open-settings").trigger("click"), a.contentItemData.settings.opened = !0)
                    }, 1)
                };
                a.openItem = function(b) {
                    e.open({
                        items: a.slides,
                        index: b,
                        position: a.contentItemData.settings.textPosition.id
                    })
                }, a.$watch("contentItemData.settings", function() {
                    g()
                }, !0)
            },
            template: '<div ng-include="getGalleryTemplate()"></div>'
        }
    }]), angular.module("msContentItemSlideShow").directive("msContentItemSlideShowEdit", ["$compile", "$timeout", "Config", "MediaLibraryManager", "$window", "msLightbox", function(a, b, c, d, e, f) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(a, e) {
                a.editableId = d.randomString(), a.openSettings = a.$parent.actions.displaySettings, a.contentItemData.settings.images = a.contentItemData.settings.images || [];
                var g = function() {
                    var d = {
                            id: "slideshow",
                            name: "Slideshow"
                        },
                        e = {
                            id: "right",
                            name: "Right"
                        };
                    a.contentItemData.settings.selectedType = a.contentItemData.settings.selectedType || d, a.contentItemData.settings.textPosition = a.contentItemData.settings.textPosition || e, a.contentItemData.settings.height = a.contentItemData.settings.height || 300, a.contentItemData.settings.interval = a.contentItemData.settings.interval || 5e3, a.contentItemData.settings.itemsPerRow = a.contentItemData.settings.itemsPerRow || 3, a.contentItemData.settings.showCaptionsInGrid = a.contentItemData.settings.showCaptionsInGrid || !1, a.contentItemData.settings.cropImages = a.contentItemData.settings.cropImages || !1;
                    var f = a.slides = [];
                    if (a.addSlide = function(a) {
                            f.push({
                                image: a.url,
                                caption: a.caption,
                                description: a.description
                            })
                        }, a.getGalleryTemplate = function() {
                            return a.contentItemData.settings.images.length > 0 ? c.GetEndPoint("modulesDirectory") + "/msContentItemSlideShow/gallery." + a.contentItemData.settings.selectedType.id + ".tpl.html" : c.GetEndPoint("modulesDirectory") + "/msContentItemSlideShow/gallery.noimages.tpl.html"
                        }, "slideshow" === a.contentItemData.settings.selectedType.id) {
                        var g = function() {
                            b(function() {
                                $(".carousel-control, .carousel-indicators").hide()
                            })
                        };
                        a.contentItemData.settings.showControls || g()
                    } else "grid" === a.contentItemData.settings.selectedType.id && (a.itemsPerRowClass = "items-per-row-" + a.contentItemData.settings.itemsPerRow);
                    a.contentItemData.settings.images.length > 0 ? a.contentItemData.settings.images.forEach(function(b) {
                        a.addSlide(b)
                    }) : b(function() {
                        a.contentItemData.settings.opened || (angular.element("#open-settings").trigger("click"), a.contentItemData.settings.opened = !0)
                    }, 1)
                };
                a.openItem = function(b) {
                    f.open({
                        items: a.slides,
                        index: b,
                        position: a.contentItemData.settings.textPosition.id
                    })
                }, a.$watch("contentItemData.settings", function() {
                    g()
                }, !0)
            },
            template: '<div ng-include="getGalleryTemplate()"></div>'
        }
    }]), angular.module("msContentItemSlideShow").directive("msContentItemSlideShowSettings", ["$compile", "$sce", "MediaLibraryManager", "Config", "$rootScope", "$window", "$timeout", function(a, b, c, d, e, f, g) {
        return {
            restrict: "A,E",
            replace: !0,
            scope: {
                settings: "="
            },
            templateUrl: d.GetSessionStoredValue("modulesDirectory") + "/msContentItemSlideShow/slideShowSettings.html",
            link: function(a, b) {
                a.galleryTypes = [{
                    id: "slideshow",
                    name: "Slideshow"
                }, {
                    id: "grid",
                    name: "Grid"
                }], a.textPosition = [{
                    id: "right",
                    name: "Right"
                }, {
                    id: "below",
                    name: "Below"
                }], a.settings.selectedType = a.settings.selectedType || a.galleryTypes[0], a.settings.selectedPosition = a.settings.textPosition || a.textPosition[0], a.settings.images = a.settings.images || [], a.settings.showCaptionsInGrid = a.settings.showCaptionsInGrid || !1, a.settings.cropImages = a.settings.cropImages || !1, a.images = [], a.deleteImage = function(b) {
                    a.settings.images.splice(b, 1)
                }, a.editableId = c.randomString();
                var d = function(b) {
                    var c = [];
                    angular.forEach(b, function(b) {
                        angular.forEach(a.settings.images, function(a) {
                            a.$$hashKey === b && c.push(a)
                        })
                    }), a.settings.images = [], a.settings.images = c
                };
                $(".image-wrap", b).sortable({
                    items: ".image",
                    tolerance: "pointer",
                    distance: 1,
                    stop: function(a, b) {
                        var c = $(this).sortable("toArray", "id");
                        d(c)
                    }
                }), $("#height", b).slider({
                    min: 175,
                    max: 900,
                    range: "min",
                    value: a.settings.height,
                    slide: function(b, c) {
                        a.settings.height = c.value, a.$apply()
                    }
                }), $("#itemsPerRow", b).slider({
                    min: 1,
                    max: 10,
                    range: "min",
                    value: a.settings.itemsPerRow,
                    slide: function(b, c) {
                        a.settings.itemsPerRow = c.value, a.$apply()
                    }
                }), $("#interval", b).slider({
                    min: 10,
                    max: 1e4,
                    step: 10,
                    range: "min",
                    value: a.settings.interval,
                    slide: function(b, c) {
                        a.settings.interval = c.value, a.$apply()
                    }
                }), a.$watch("images", function() {
                    a.images.length > 0 && a.settings.images.push({
                        url: a.images[0].url,
                        caption: a.images[0].caption
                    })
                }), a.$watch("settings", function(a, b) {
                    a !== b && e.$broadcast("slideshowSettingsChange")
                }, !0)
            }
        }
    }]), angular.module("msMetaTags", []), angular.module("msMetaTags").directive("metaTags", ["$compile", "MetaTagsManager", "Config", function(a, b, c) {
        return {
            scope: {
                metaTags: "="
            },
            restrict: "AE",
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msMetaTags/msMetaTags.tpl.html",
            link: function(a, c, d) {
                a.getMetaTagType = b.getMetaTagType, a.delete = function(b) {
                    a.metaTags.splice(b, 1)
                }, a.add = function() {
                    var c = b.parseMetaTag(a.newMetaTag);
                    c ? (a.error = !1, a.newMetaTag = "", a.metaTags.push(c)) : a.error = !0
                }, a.metaTags = a.metaTags || []
            }
        }
    }]).factory("MetaTagsManager", [function() {
        var a = {
            "google-site-verification": "Google verification",
            "p:domain_verify": "Pinterest verification"
        };
        return {
            getMetaTagType: function(b) {
                return b ? b.name ? a[b.name] ? a[b.name] : b.name : b.attributes && b.attributes[0] ? b.attributes[0].name : "" : ""
            },
            parseMetaTag: function(a) {
                var b;
                if (a.match(/^\s*<meta(\s*([^="'\s]+)=("|')([^'"]+)("|'))*\s*\/>\s*$/)) {
                    var c = a.match(/([^="'\s]+)=("|')([^'"]+)("|')/g);
                    if (c && c.length > 0) {
                        b = {
                            attributes: []
                        };
                        for (var d = 0; c[d]; d++) {
                            var e = c[d].match(/([^="'\s]+)=(?:"|')([^'"]+)(?:"|')/);
                            e && e.length > 2 && ("name" === e[1] && (b.name = e[2]), b.name || (b.name = e[1]), b.attributes.push({
                                name: e[1],
                                value: e[2]
                            }))
                        }
                    }
                }
                return b
            }
        }
    }]), angular.module("msSettingsPopup", ["msMetaTags"]), angular.module("msSettingsPopup").directive("msSettingsPopup", [function(a) {
        return {
            restrict: "A",
            link: function(a, b, c) {}
        }
    }]), angular.module("msContentItemSpacer", []), angular.module("msContentItemSpacer").directive("msContentItemSpacer", ["Helper", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            template: '<div style="height:{{contentItemData.settings.height}}px" class="ms-spacer"></div>',
            link: function(b) {
                b.contentItemData.id = b.contentItemData.id || a.guid(), b.contentItemData.settings = b.contentItemData.settings || {}, b.contentItemData.settings.height = b.contentItemData.settings.height || 20
            }
        }
    }]), angular.module("msContentItemSpacer").directive("msContentItemSpacerSettings", ["$rootScope", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Height</label><div class="slider"></div></div></div></div>',
            link: function(b, c) {
                b.settings = b.settings || {
                    height: 100
                }, $(".slider", c).slider({
                    min: 5,
                    max: 800,
                    range: "min",
                    value: b.settings.height,
                    slide: function(a, c) {
                        b.settings.height = c.value, b.$apply()
                    }
                }), b.$watch("settings", function(b, c) {
                    b !== c && a.$broadcast("markChanges", "spacer settings has been changed.")
                }, !0)
            }
        }
    }]), angular.module("msContentItemVideo", []), angular.module("msContentItemVideo").directive("msContentItemVideo", ["$compile", "moduleMsContentItemVideoManager", "Config", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(c, d) {
                var e = '<div class="ms-no-settings">Add your embed code in the widget settings</div>',
                    f = "",
                    g = b.getVideoCodeFromUrl(c.contentItemData.settings.url);
                g && ("youtube" === g.type ? (f = "//www.youtube.com/embed/" + g.id, e = '<div class="video-wrapper"><iframe width="560px" height="315px" src="' + f + '"  frameborder="0" allowfullscreen></iframe></div>') : "vimeo" === g.type && (f = "//player.vimeo.com/video/" + g.id, e = '<div class="video-wrapper"><iframe src="' + f + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')), a(e)(c, function(a) {
                    d.html(a)
                })
            }
        }
    }]), angular.module("msContentItemVideo").directive("msContentItemVideoEdit", ["$compile", "moduleMsContentItemVideoManager", "Config", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(c, d) {
                c.contentItemData.settings.height = c.contentItemData.settings.height || 315, c.url = c.url || "";
                var e = function(b) {
                    var e = '<div class="ms-no-settings ms-tools">Video<input type="text" ng-model="url" placeholder="Enter YouTube or Vimeo link here" /><button ng-click="ok()" class="ms-button primary" >OK</button></div>',
                        f = "";
                    b && ("youtube" === b.type ? (f = "//www.youtube.com/embed/" + b.id, e = '<div class="video-wrapper"><iframe width="560px" height="315px" src="' + f + '"  frameborder="0" allowfullscreen></iframe></div>') : "vimeo" === b.type && (f = "//player.vimeo.com/video/" + b.id, e = '<div class="video-wrapper"><iframe src="' + f + '" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>')), a(e)(c, function(a) {
                        d.html(a)
                    })
                };
                e(c.contentItemData.settings.url), c.ok = function() {
                    c.contentItemData.settings.url = c.url
                }, c.$watch("contentItemData.settings", function() {
                    var a = b.getVideoCodeFromUrl(c.contentItemData.settings.url);
                    e(a)
                }, !0)
            }
        }
    }]), angular.module("msContentItemVideo").factory("moduleMsContentItemVideoManager", [function() {
        return {
            getVideoCodeFromUrl: function(a) {
                var b = !1,
                    c = {};
                if (a) {
                    if (a.match("//(www.)?youtube|youtu.be")) {
                        var d = "";
                        d = a.match("embed") ? a.split(/embed\//)[1].split('"')[0] : a.split(/v\/|v=|youtu.be\//)[1].split(/[?&]/)[0], c.type = "youtube", c.id = d, b = !0
                    } else if (a.match("//(player.)?vimeo\\.com")) {
                        var e = "";
                        if (a.match("video")) e = a.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
                        else {
                            var f = a.split(/\/\/vimeo\.com\//)[1].split(/[/]/);
                            e = f[f.length - 1]
                        }
                        c.type = "vimeo", c.id = e, b = !0
                    }
                    return b ? c : "No valid media id detected"
                }
                return !1
            }
        }
    }]), angular.module("msContentItemVideo").directive("msContentItemVideoSettings", ["$compile", "$rootScope", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Youtube or Vimeo video url</label><input type="text" value="{{settings.url}}" ng-model="settings.url" /></div></div></div>',
            link: function(a, c) {
                $(".videoHeightSlider", c).slider({
                    min: 0,
                    max: 1e3,
                    range: "min",
                    value: a.settings.height,
                    slide: function(b, c) {
                        a.settings.height = c.value, a.$apply()
                    }
                }), a.$watch("settings", function(a, c) {
                    a !== c && b.$broadcast("markChanges", "video settings has been changed.")
                }, !0)
            }
        }
    }]), angular.module("msBasketRepository", []), angular.module("msBasketRepository").factory("BasketRepository", ["$q", "$window", "$sessionStorage", function(a, b, c) {
        var d, e = function() {
                d = {
                    items: []
                }
            },
            f = function() {
                var b = a.defer();
                return b.resolve(d.items), b.promise
            },
            g = function(a) {
                for (var b = 0; d.items[b]; b++)
                    if (d.items[b].id === a) return b
            },
            h = function(a) {
                var b = g(a);
                return void 0 !== b ? d.items[b] : void 0
            },
            i = function() {
                c.put("basket", JSON.stringify(d))
            },
            j = function() {
                c.get("basket") && (d = JSON.parse(c.get("basket")))
            };
        return e(), j(), {
            getItems: f,
            saveItems: i,
            getItemById: h,
            getItemIndexById: g,
            reset: e
        }
    }]), angular.module("msBasketManager", ["msBasketRepository"]), angular.module("msBasketManager").factory("BasketManager", ["$q", "BasketRepository", function(a, b) {
        var c = function(a, b, c, d, e, f, g) {
                return {
                    id: a,
                    name: b,
                    imgUrl: c,
                    quantity: d,
                    price: e,
                    attributes: f,
                    stockLevel: g
                }
            },
            d = function(c) {
                var d = a.defer();
                return b.getItems().then(function(a) {
                    var d = b.getItemIndexById(c);
                    if ((d || 0 === d) && a[d]) {
                        var e = a[d];
                        return e.quantity < 0 && (e.quantity = 0), 0 === e.quantity ? k(c) : void 0
                    }
                }).then(function() {
                    d.resolve()
                }), d.promise
            },
            e = function(c, e) {
                var f = a.defer();
                return b.getItems().then(function(a) {
                    var f = b.getItemById(c);
                    return !!f && (f.quantity = e, d(c))
                }).then(function(a) {
                    b.saveItems(), f.resolve(a)
                }), f.promise
            },
            f = function(c, e) {
                var f = a.defer();
                return b.getItems().then(function(a) {
                    var f = b.getItemById(c);
                    if (f) return f.quantity += e, d(c)
                }).then(function() {
                    b.saveItems(), f.resolve()
                }), f.promise
            },
            g = function(e, f, g, h, i, j, k) {
                var l = a.defer();
                return b.getItems().then(function(a) {
                    var l = b.getItemById(e);
                    return l ? l.quantity += h : a.push(c(e, f, g, h, i, j, k)), d(e)
                }).then(function() {
                    b.saveItems(), l.resolve()
                }), l.promise
            },
            h = function(a, c, d, e, f, g, h) {
                return b.getItemById(a)
            },
            i = function() {
                return b.getItems()
            },
            j = function() {
                return b.reset()
            },
            k = function(c) {
                var d = a.defer();
                return b.getItems().then(function(a) {
                    var d = b.getItemIndexById(c);
                    (d || 0 === d) && (a[d].quantity = 0, a.splice(d, 1))
                }).then(function() {
                    b.saveItems(), d.resolve()
                }), d.promise
            };
        return {
            updateQuantity: e,
            incrementQuantity: f,
            addItem: g,
            getItemById: h,
            listItems: i,
            deleteItem: k,
            emptyBasket: j
        }
    }]), angular.module("msShopModules", ["msBasketManager"]), angular.module("msShopModules").directive("msAddItem", ["$timeout", "Config", function(a, b) {
        return {
            restrict: "A",
            scope: {
                model: "=model",
                autoCompleteItems: "=autoCompleteItems"
            },
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msShopModules/addItem.html",
            link: function(b, c, d) {
                a(function() {
                    b.model
                }), b.inputAdd = "", b.buttonText = d.buttonText, b.label = d.label, b.showError = !1, a(function() {
                    c.find("input.ui-autocomplete-input").attr("placeholder", d.placeholder)
                }, 500);
                var e, f = c.find("input");
                b.setErrorFalse = function() {
                    a(function() {
                        f.hasClass("ms-focused") || (b.showError = !1)
                    }, 1500)
                }, b.setError = function() {
                    b.showError = !1, 0 === f.val().trim().length && (b.showError = "You must enter a name"), angular.forEach(b.model, function(a) {
                        if (f.val().trim().toLowerCase() === a.name.trim().toLowerCase()) return void(b.showError = "You've already added '" + f.val().trim() + "'")
                    })
                }, b.addItem = function() {
                    if (a(function() {
                            $(f).trigger("focus")
                        }), b.setError(), b.showError) return !1;
                    e = {
                        name: f.val(),
                        options: []
                    }, a(function() {
                        $(f).val("")
                    }, 100), b.model.push(e)
                }
            }
        }
    }]), angular.module("msShopModules").factory("AppRestangular", ["Restangular", function(a) {
        return a.withConfig(function(a) {
            a.setBaseUrl("/")
        })
    }]), angular.module("msShopModules").factory("ApiRestangular", ["Restangular", "Config", function(a, b) {
        return a.withConfig(function(a) {
            a.setBaseUrl(b.GetEndPoint("siteApiEndpoint"))
        })
    }]), angular.module("msShopModules").factory("AppVersionService", ["AppRestangular", "ApiRestangular", "HelperService", function(a, b, c) {
        var d = {};
        return d.getAppVersion = function(b) {
            a.one("version.txt").get().then(function(a) {
                b(a.data)
            }, function(a) {
                b(c.getMessage(a.data))
            })
        }, d.getApiVersion = function(a) {
            b.one("version").get().then(function(b) {
                a(b.data)
            }, function(b) {
                a(c.getMessage(b.data))
            })
        }, d
    }]), angular.module("msShopModules").factory("$authShop", ["Restangular", "$window", "$sessionStorage", function(a, b, c) {
        var d = {};
        d.isLoggedIn = function() {
            return void 0 !== c.get("token") && "" !== c.get("token") && "null" !== c.get("token") && (void 0 === a.defaultHeaders.Authorization && e(), !0)
        }, d.setToken = function(a) {
            return c.put("token", a), e(), !0
        }, d.setIdToken = function(a) {
            return c.put("idToken", a), e(), !0
        }, d.setShopId = function(a) {
            return c.put("shopId", a), e(), !0
        };
        var e = function() {
            a.setDefaultHeaders({
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Bearer " + c.get("token"),
                "Authorization-Id": "Bearer " + c.get("idToken")
            })
        };
        return d
    }]), angular.module("msShopModules").directive("msAutocomplete", ["$timeout", function(a) {
        return {
            restrict: "A",
            scope: {
                autoCompleteItems: "=autoCompleteItems",
                model: "=model"
            },
            link: function(a, b) {
                if (a.model) {
                    a.autoCompleteItems = a.autoCompleteItems ? a.autoCompleteItems : [], $(b).parent().addClass("ui-front"), $(b).autocomplete({
                        source: a.autoCompleteItems,
                        autoFocus: !0
                    }).bind("focus", function() {
                        $(this).autocomplete("search")
                    });
                    var c = a.autoCompleteItems,
                        d = [];
                    a.$watchCollection("model", function(e) {
                        c = a.autoCompleteItems, d = [], angular.forEach(e, function(a, b) {
                            d[b] = a.name
                        }), c = c.filter(function(a) {
                            return d.indexOf(a) < 0
                        }), $(b).autocomplete("option", {
                            source: c
                        })
                    })
                }
            }
        }
    }]), angular.module("msShopModules").directive("msAviary", ["$timeout", "HelperService", "$window", "$http", "$sessionStorage", function(a, b, c, d, e) {
        return {
            restrict: "A",
            scope: {
                images: "=msAviaryImages"
            },
            template: '<li data-ng-repeat="(key, img) in images">  <img ng-src="{{img.url}}"" id="img-{{key}}"" data-ng-click="launchEditor($index)"" width="300" /> </li>',
            link: function(a) {
                var b, c, f = {
                    Authorization: "Bearer " + e.get("token"),
                    "Content-Type": "image/jpeg"
                };
                c = new Aviary.Feather({
                    apiKey: "166143ab5f52e45a",
                    apiVersion: 3,
                    theme: "light",
                    tools: "crop,brightness,contrast,orientation",
                    cropPresets: ["Original", ["Square", "1:1"], "3:2", "5:3", "4:3", "5:4", "6:4", "7:5", "10:8", "16:9"],
                    appendTo: "",
                    onSave: function(a, c) {
                        b = document.getElementById(a), b.src = c, d({
                            method: "POST",
                            url: "http://192.168.1.160/api/upload",
                            data: c,
                            headers: f
                        }).success(function(a, b, c, d) {}).error(function(a, b, c, d) {})
                    },
                    onError: function(a) {
                        alert(a.message)
                    }
                }), a.launchEditor = function(b) {
                    return c.launch({
                        image: "img-" + b,
                        url: a.images[b].url
                    }), !1
                }
            }
        }
    }]), angular.module("msShopModules").directive("msDraggable", ["$timeout", function(a) {
        return {
            restrict: "A",
            transclude: !0,
            scope: {
                ngModel: "=msDraggable"
            },
            replace: !0,
            template: "<ul ng-transclude></ul>",
            link: function(a, b, c) {
                var d, e, f;
                $(b).sortable({
                    delay: 150,
                    revert: !0,
                    scroll: !1,
                    placeholder: "sortable-placeholder",
                    cancel: ".ui-state-disabled",
                    forcePlaceholderSize: !0,
                    forceHelperSize: !0,
                    containment: "parent",
                    axis: "y",
                    tolerance: "pointer",
                    start: function(a, b) {
                        d = $(b.item).index(), $(this).addClass("no-float")
                    },
                    update: function(b, c) {
                        $(this).removeClass("no-float"), e = $(c.item).index(), f = a.ngModel[d], a.ngModel.splice(d, 1), a.ngModel.splice(e, 0, f), $(this).children("li").eq(e).insertBefore($(this).children("li").eq(d)), a.$apply()
                    }
                }).disableSelection().sortable("disable"), a.$watch("ngModel", function(c, d) {
                    c !== d && a.ngModel.length > 1 && $(b).sortable("enable")
                }, !0)
            }
        }
    }]), angular.module("msShopModules").directive("msExpander", function() {
        return {
            restrict: "A",
            link: function(a, b, c) {
                var d, e, f, g, h, i, j;
                b.on("click", "a.edit", function() {
                    function a() {
                        if (d.hasClass("expanded")) return !1;
                        b.find("li.expanded").removeClass("expanded"), b.find(".expander").not(":eq(" + f + ")").hide(), j.show(), d.addClass("expanded")
                    }

                    function c() {
                        if (d.hasClass("expanded")) return !1;
                        b.find("li.expanded").removeClass("expanded"), b.find(".expander").not(":eq(" + f + ")").slideUp(), j.slideDown(), d.addClass("expanded")
                    }
                    d = $(this).parents("li"), j = d.find(".expander"), e = d.outerHeight(), f = d.index(), g = j.outerHeight(), h = b.find("li.expanded").offset(), i = d.offset(), 0 === b.find("li.expanded").length ? c() : h.top === i.top ? a() : c()
                }).on("click", "a.close", function() {
                    j.slideUp(), d.removeClass("expanded")
                })
            }
        }
    }), angular.module("msShopModules").directive("msFilter", ["$timeout", "HelperService", "Config", function(a, b, c) {
        return {
            restrict: "A",
            scope: {
                searchQuery: "=msFilterSearchQuery",
                response: "=msFilterResponse",
                staticFilters: "=msStaticFilters"
            },
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msShopModules/filter.html",
            link: function(c, d) {
                c.filtered = {}, void 0 === c.searchQuery ? c.searchQuery = {
                    Facets: {},
                    PageNum: 0,
                    PageSize: 10,
                    Query: ""
                } : void 0 !== c.searchQuery.Facets && (c.filtered = c.searchQuery.Facets), c.filterCount = 0, c.setTagitVisibility = function() {
                    c.tagitVisibilityClass = Object.keys(c.filtered).length > 0
                }, c.setTagitVisibility(), c.removeActiveFilters = function(a) {
                    return angular.forEach(c.filtered, function(b, c) {
                        angular.forEach(b.Values, function(b) {
                            void 0 !== a && void 0 !== a[c] && void 0 !== a[c][b] && delete a[c][b]
                        })
                    }), a
                }, c.$watch("response.FacetList", function(a) {
                    void 0 !== a && (c.filters = c.removeActiveFilters(c.response.FacetList))
                }), c.doSearch = function() {
                    c.searchQuery.PageNum = 0, c.setTagitVisibility()
                }, c.$watch("searchQuery.Query", b.debounce(function() {
                    c.searchQuery.Query = this.last
                }, 500, !1)), c.addItem = function(a, b) {
                    c.filterCount++, void 0 === c.filtered[a] && (c.filtered[a] = {
                        Values: []
                    }), c.filtered[a].Values.push(b), c.filterGroupSelect = 0, c.filterSelect = 0, c.searchQuery.Facets = c.filtered, c.doSearch()
                }, c.deleteItem = function(a, b) {
                    c.filterCount--, c.filtered[a].Values.splice(b, 1), c.searchQuery.Facets = c.filtered, c.doSearch()
                };
                var e = d.find("select.select-value");
                c.triggerSelectValue = function() {
                    a(function() {
                        if (e.find("option.default").insertBefore(e.find("option:first-child")), e[0].selectedIndex = 0, document.createEvent) {
                            var a = document.createEvent("MouseEvents");
                            a.initMouseEvent("mousedown", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), e[0].dispatchEvent(a)
                        } else d.fireEvent && e[0].fireEvent("onmousedown")
                    })
                }
            }
        }
    }]), angular.module("msShopModules").filter("removeInvalidChars", function() {
        return function(a) {
            return a.replace(/[^a-zA-Z\s]/g, " ")
        }
    }).filter("fixedOrder", function() {
        return function(a) {
            return a ? Object.keys(a) : []
        }
    }).filter("addAnotherFilterHere", function() {
        return function(a) {
            return a + "s"
        }
    }), angular.module("msShopModules").directive("msFocus", [function() {
        var a = "ms-focused";
        return {
            restrict: "A",
            require: "ngModel",
            link: function(b, c, d, e) {
                e.$focused = !1, c.bind("focus", function(f) {
                    c.addClass(a), b.$apply(function() {
                        e.$focused = !0
                    }), d.msFocus && b.$eval(d.msFocus)
                }).bind("blur", function(f) {
                    c.removeClass(a), b.$apply(function() {
                        e.$focused = !1
                    }), d.msFocusBlur && b.$eval(d.msFocusBlur)
                })
            }
        }
    }]), angular.module("msShopModules").factory("HelperService", ["$timeout", "$rootScope", "MessageModel", function(a, b, c) {
        var d = {};
        return d.combineArr = function(a) {
            function b(e, f) {
                for (var g = 0, h = a[f].length; g < h; g++) {
                    var i = e.slice(0);
                    i.push(a[f][g]), f === d ? c.push(i) : b(i, f + 1)
                }
            }
            var c = [],
                d = a.length - 1;
            return b([], 0), c
        }, d.appendUrl = function(a) {
            return a
        }, d.getMessage = function(a) {
            var b = c.create();
            return void 0 !== a && void 0 !== a.ModelState && (b.title = a.Message, b.message = a.ModelState[""].join(", "), b.exception = a.ExceptionMessage), b
        }, d.setMesasge = function(a, b, d) {
            var e = c.create();
            return e.title = a, e.message = b, e.exception = d, e
        }, d.getAvailableTags = function(a, b) {
            return a.collection[b]
        }, d.getTitle = function(a) {
            for (var b = [], c = 0; c < a.length; c++) void 0 !== a[c].options && a[c].options.length && (b[c] = a[c].name);
            return b
        }, d.debounce = function(b, c, d) {
            var e, f, g, h, i, j = function() {
                var k = (new Date).getTime() - h;
                k < c ? e = a(j, c - k) : (e = null, d || (i = b.apply(g, f), g = f = null))
            };
            return function() {
                g = this, f = arguments, h = (new Date).getTime();
                var k = d && !e;
                return e || (e = a(j, c)), k && (i = b.apply(g, f), g = f = null), i
            }
        }, d.getModelMessages = function(a) {
            return b.rootMessage = a, a
        }, d
    }]), angular.module("msShopModules").factory("ListModel", function() {
        var a;
        return a = function() {
            var a = this;
            a.FacetList = {}, a.ResourceList = [], a.SearchQuery = {}, a.TotalResults = ""
        }, {
            create: function(b) {
                if (void 0 !== b) {
                    var c = new a;
                    return c.FacetList = b.FacetList ? b.FacetList : {}, c.ResourceList = b.ResourceList ? b.ResourceList : [], c.SearchQuery = b.SearchQuery ? b.SearchQuery : {}, c.TotalResults = b.TotalResults ? b.TotalResults : "", c
                }
                return new a
            }
        }
    }), angular.module("msShopModules").factory("listService", ["Restangular", function(a) {
        var b = {};
        return b.search = function(b, c) {
            return "products" === c ? a.one("search/products").get(b) : a.one(c).get(b)
        }, b.remove = function(b, c) {
            return a.one(c, b).remove()
        }, b
    }]), angular.module("msShopModules").directive("msMaxHeight", ["$timeout", "HelperService", function(a, b) {
        return {
            restrict: "A",
            scope: {
                maxHeightModel: "=msMaxHeightModel"
            },
            transclude: !0,
            replace: !0,
            template: '<div ng-transclude class="max-height" style="max-height: {{msMaxHeight}}px; -webkit-transition: max-height .3s; transition: max-height .3s;"></div>',
            link: function(c, d, e) {
                function f() {
                    g = void 0 === g ? $("." + j[0]) : g, h = void 0 === h ? $("." + j[1]) : h, i = void 0 === i ? $("." + j[2]) : i, l = void 0 !== g ? g.outerHeight(!0) : 0, m = void 0 !== h ? h.offset().top + h.outerHeight(!0) : 0, n = void 0 !== i ? i.outerHeight(!0) : 0, k = l - (m + n) - o, c.msMaxHeight = k || 100
                }
                if (e.msMaxHeight) {
                    var g, h, i, j = e.msMaxHeight.split(" "),
                        k = 0,
                        l = 0,
                        m = 0,
                        n = 0,
                        o = e.msMaxHeightOffset ? e.msMaxHeightOffset : 0,
                        p = $(window);
                    p.on("resize", b.debounce(function() {
                        f()
                    }, 500, !1)), c.$watch("msMaxHeightModel", function(b, c) {
                        a(function() {
                            f()
                        }, 1e3)
                    }), e.msMaxHeightOverflowYHidden && $("." + e.msMaxHeightOverflowYHidden).css("overflow-y", "hidden"), c.$on("$destroy", function() {
                        $("." + e.msMaxHeightOverflowYHidden).attr("style", ""), p.off("resize")
                    })
                }
            }
        }
    }]), angular.module("msShopModules").factory("MessageModel", function() {
        var a;
        return a = function() {
            var a = this;
            a.title = "", a.message = "", a.exception = ""
        }, {
            create: function(b) {
                if (void 0 !== b) {
                    var c = new a;
                    return c.title = b.title, c.message = b.message, c.exception = b.exception, c
                }
                return new a
            }
        }
    }), angular.module("msShopModules").directive("msModal", function() {
        return {
            restrict: "A",
            scope: {
                msAddshadow: "@"
            },
            link: function(a, b, c) {
                var d = b.find(".modal"),
                    e = b.find(".modal-open"),
                    f = b.find(".modal-close");
                e.on("click", function() {
                    d.before('<div class="modal-overlay"></div>'), d.addClass("show")
                }), f.on("click", function() {
                    $(".modal-overlay").remove(), d.removeClass("show")
                })
            }
        }
    }), angular.module("msShopModules").factory("OrderModel", function() {
        var a = function() {
            var a = this;
            a.id = "", a.customerName = "", a.customerEmail = "", a.customerPhone = "", a.billing = {}, a.billing.name = "", a.billing.company = "", a.billing.phone = "", a.billing.address = {}, a.billing.address.addressLine1 = "", a.billing.address.addressLine2 = "", a.billing.address.city = "", a.billing.address.country = "", a.billing.address.postCode = "", a.shipping = {}, a.shipping.name = "", a.shipping.company = "", a.shipping.phone = "", a.shipping.address = {}, a.shipping.address.addressLine1 = "", a.shipping.address.addressLine2 = "", a.shipping.address.city = "", a.shipping.address.country = "", a.shipping.address.postCode = "", a.shippingMethod = "", a.billingMethod = "", a.orderItems = [], a.notes = [], a.status = "New", a.tAndC = "", a.tax = "", a.total = "", a.created = "", a.modified = "", a.modifiedBy = ""
        };
        return {
            create: function(b) {
                if (void 0 === b) return new a;
                var c = new a;
                return c.id = b.id, c.customerName = b.customerName, c.customerEmail = b.customerEmail, c.customerPhone = b.phone, c.billing = {}, c.billing.name = b.billing.name, c.billing.company = b.billing.company, c.billing.phone = b.billing.phone, c.billing.address = {}, c.billing.address.addressLine1 = b.billing.address.addressLine1, c.billing.address.addressLine2 = b.billing.address.addressLine2, c.billing.address.city = b.billing.address.city, c.billing.address.country = b.billing.address.country, c.billing.address.postCode = b.billing.address.postCode, c.shipping = {}, c.shipping.name = b.shipping.name, c.shipping.company = b.shipping.company, c.shipping.phone = b.shipping.phone, c.shipping.address = {}, c.shipping.address.addressLine1 = b.shipping.address.addressLine1, c.shipping.address.addressLine2 = b.shipping.address.addressLine2, c.shipping.address.city = b.shipping.address.city, c.shipping.address.country = b.shipping.address.country, c.shipping.address.postCode = b.shipping.address.postCode, c.shippingMethod = b.shippingMethod, c.billingMethod = b.billingMethod, c.orderItems = b.orderItems, c.notes = b.orderNotes, c.status = b.status, c.tAndC = b.termsAndCondition, c.tax = "", c.total = b.totalAmount, c.created = "", c.modified = "", c.modifiedBy = "", c
            }
        }
    }), angular.module("msShopModules").factory("OrderService", ["ShopRestangular", "$q", function(a, b) {
        var c = function(c) {
            for (var d = {}, e = 0; c[e]; e++) d[c[e].id] = c[e].quantity;
            var f = b.defer();
            return a.all("orders").post(d).then(function(a) {
                f.resolve(a.data)
            }, function(a) {
                f.resolve(a)
            }), f.promise
        };
        return {
            GetAllOrder: function(c) {
                var d = b.defer();
                return c = c || "All", a.one("orders/" + c + "/list").get().then(function(a) {
                    var b = a.data;
                    d.resolve(b)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            GetOrderById: function(c) {
                var d = b.defer();
                return a.one("orders", c).get().then(function(a) {
                    var b = a.data;
                    d.resolve(b)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            createOrder: c,
            UpdateOrderStatus: function(c, d) {
                var e = b.defer(),
                    f = {
                        Status: d
                    };
                return a.all("orders/" + c + "/status").customPUT(f).then(function(a) {
                    e.resolve(a)
                }, function(a) {
                    e.resolve(a)
                }), e.promise
            }
        }
    }]), angular.module("msShopModules").directive("msPager", ["Config", function(a) {
        return {
            restrict: "A",
            scope: {
                searchQuery: "=msSearchQuery",
                response: "=msPagerResponse"
            },
            templateUrl: a.GetSessionStoredValue("modulesDirectory") + "/msShopModules/pager.html",
            link: function(a) {
                void 0 === a.searchQuery && (a.searchQuery = {
                    Facets: {},
                    PageNum: 0,
                    PageSize: 10,
                    Query: ""
                });
                var b, c = [];
                a.$watch("response", function(d) {
                    if (void 0 !== d && d.TotalResults) {
                        if (b = Math.ceil(d.TotalResults / a.searchQuery.PageSize), a.totalPages = d.TotalResults > 1 ? b : 0, c = [], a.searchQuery.PageNum + 1 <= 3)
                            for (var e = 0; e < 5; e++) c.push(e + 1);
                        else if (a.searchQuery.PageNum + 1 < b - 2)
                            for (var f = a.searchQuery.PageNum - 2; f < a.searchQuery.PageNum + 3; f++) c.push(f + 1);
                        else if (a.searchQuery.PageNum + 1 >= b - 3)
                            for (var g = b - 5; g < b; g++) c.push(g + 1);
                        a.pageNumbers = c
                    } else a.pageNumbers = 0, a.totalPages = 0
                }, !0), a.first = function() {
                    a.searchQuery.PageNum = 0
                }, a.back = function() {
                    a.searchQuery.PageNum--
                }, a.next = function() {
                    a.searchQuery.PageNum++
                }, a.last = function() {
                    a.searchQuery.PageNum = a.totalPages - 1
                }, a.goTo = function(b) {
                    a.searchQuery.PageNum = b - 1
                }
            }
        }
    }]), angular.module("msShopModules").factory("ProductListModel", function() {
        var a;
        return a = function() {
            var a = this;
            a.FacetList = {}, a.ProductList = [], a.SearchQuery = {}, a.Total = ""
        }, {
            create: function(b) {
                if (void 0 !== b) {
                    var c = new a;
                    return c.FacetList = b.FacetList, c.ResourceList = b.ResourceList, c.SearchQuery = b.SearchQuery, c.TotalResults = b.TotalResults, c
                }
                return new a
            }
        }
    }), angular.module("msShopModules").factory("ProductModel", function() {
        return {
            create: function(a) {
                return void 0 === a ? {
                    name: "",
                    description: "",
                    images: [],
                    attributes: [],
                    variants: [],
                    categories: [],
                    tags: [],
                    fields: [],
                    published: !1,
                    productSettings: {
                        taxSettings: {
                            taxExempt: !1
                        },
                        additionalShipping: 0
                    }
                } : {
                    id: a.id,
                    name: a.name,
                    description: a.description,
                    images: a.images,
                    attributes: a.attributes.ResourceList,
                    variants: a.variants.ResourceList,
                    categories: a.categories,
                    tags: a.tags,
                    fields: a.fields,
                    published: a.published,
                    productSettings: a.productSettings
                }
            }
        }
    }), angular.module("msShopModules").factory("ProductService", ["ShopRestangular", "$q", function(a, b) {
        var c, d = {},
            e = 0;
        return d.getAll = function(f) {
            if (!c || f) {
                var g = b.defer();
                a.one("products", "").get().then(function(a) {
                    return a && a.data && a.data.ResourceList ? a.data.ResourceList : []
                }, function(a) {
                    if (++e <= 5) return d.getAll(!0)
                }).then(function(a) {
                    g.resolve(a)
                }), c = g.promise
            }
            return c
        }, d.get = function(c) {
            var d = b.defer();
            return a.one("products", c).get().then(function(a) {
                var b = a.data;
                d.resolve(b)
            }, function(a) {
                d.resolve(a)
            }), d.promise
        }, d.save = function(b) {
            return c = void 0, a.all("products").post(b)
        }, d.update = function(b, d) {
            return c = void 0, a.all("products/" + b).customPUT(d)
        }, d.remove = function(b) {
            return c = void 0, a.all("products/" + b).remove()
        }, d
    }]), angular.module("msShopModules").directive("msAddshadow", function() {
        return {
            restrict: "A",
            scope: {
                msAddshadow: "@"
            },
            link: function(a, b, c) {
                var d = $("." + a.msAddshadow).scrollTop();
                $("." + a.msAddshadow).on("scroll", function() {
                    d > 5 ? b.addClass("shadow") : b.removeClass("shadow")
                })
            }
        }
    }), angular.module("msShopModules").factory("ShopModel", function() {
        var a = function() {
            var a = this;
            a.owner = "", a.categories = ["Food", "Fruit", "Baby", "Clothes", "Jeans", "Book"], a.tags = ["Food", "Fruit", "Baby", "Clothes", "Jeans", "Book", "3D", "Adsense", "advertising", "AJAX", "animation", "Apps", "Art", "ASCII", "Avatars", "Backgrounds", "Best Of", "Best Practices", "blogging", "Books", "branding", "Browsers", "brushes", "Business", "Business cards", "buttons", "Calendars", "Calligraphy", "cartoons", "carts", "CG", "charts", "Cheat Sheets", "Christmas", "Clients", "CMS", "CMYK", "coding", "colors", "Communication", "Community", "Conferences", "Content", "Contests", "contracts", "Copywriting", "corporate", "covers", "Creativity", "CSS", "data visualization", "Design", "development", "diagrams", "Discussions", "domains", "Downloads", "drawing", "dreamweaver", "E-Commerce", "eBooks", "editors", "Email", "Emotional Design", "Errors", "Events", "FAQ", "favicons", "Flash", "Fonts", "Forms", "Freebies", "Free Fonts", "gadgets", "galleries", "Global Web Design", "Google", "Graphics", "grids", "guidelines", "halloween", "Icons", "ideas", "illustrations", "Illustrator", "Infographics", "innovation", "Inspiration", "Internet Explorer", "Interviews", "layouts", "legacy", "logo design", "Mac", "magazines", "Marketing", "movies", "Music", "Navigation", "Open Source", "Opinion Column", "optimization", "paintings", "PDF", "Performance", "Photography", "Photoshop", "Portfolios", "Posters", "principles", "print", "Process", "productivity", "PSD", "psychology", "retro", "reviews", "SEO", "Showcases", "signs", "Skills", "Smashing Book", "Smashing Daily", "Smashing Library", "Smashing Magazine", "Social", "software", "Studies", "Techniques", "Templates", "testing", "Textures", "The Lost Files", "Themes", "The Smashing Newsletter", "time management", "time savers", "Tools", "Trends", "Tutorials", "Twitter", "Typography", "Useful", "User Interaction", "vectors", "Videos", "vintage", "visualizations", "Wallpapers", "Web", "web 2.0", "Web Design", "weblogs", "Wireframing", "WordPress", "Workflow"], a.attributes = ["Colour", "Size", "Material"], a.fields = ["Author"], a.productTypes = ["Food", "Fruit", "Book"], a.collection = {
                Author: ["Bob", "Jimi"],
                RAM: ["1mb", "green", "blue"],
                Colour: ["red", "green", "blue"],
                Material: ["plastic", "metal", "fiber"],
                Size: ["small", "medium", "large", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
            }
        };
        return {
            create: function(b) {
                if (void 0 === b) return new a;
                var c = new a;
                return c.owner = b.owner, c.categories = b.categories, c.attributes = b.attributes, c.fields = b.fields, c.productTypes = b.productTypes, c.collection = b.collection, c
            }
        }
    }), angular.module("msShopModules").factory("ShopService", ["MenuRepository", "MenuManager", "ShopRestangular", "$q", "$locale", function(a, b, c, d, e) {
        var f, g = function() {
                var a = d.defer();
                return c.one("categories").get().then(function(b) {
                    var c = b.data;
                    a.resolve(c)
                }, function(b) {
                    a.resolve(b)
                }), a.promise
            },
            h = function() {
                var a = d.defer();
                return c.one("categoryhierarchies").get().then(function(b) {
                    var c = b.data;
                    a.resolve(c.categoryHierarchies)
                }, function(b) {
                    a.resolve(b)
                }), a.promise
            },
            i = function(a) {
                var b = d.defer();
                return c.all("categoryhierarchies").customPUT({
                    categoryHierarchies: a
                }).then(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            },
            j = function() {
                l().then(function(a) {
                    var b;
                    a.Currency && a.Currency.Symbol && (b = a.Currency.Symbol), k({
                        symbol: b || "\xa3"
                    })
                })
            },
            k = function(a) {
                e.NUMBER_FORMATS.CURRENCY_SYM = a.symbol || e.NUMBER_FORMATS.CURRENCY_SYM, e.NUMBER_FORMATS.DECIMAL_SEP = a.decimal || e.NUMBER_FORMATS.DECIMAL_SEP, e.NUMBER_FORMATS.GROUP_SEP = a.GROUP_SEP || e.NUMBER_FORMATS.GROUP_SEP
            },
            l = function() {
                if (!f) {
                    var a = d.defer();
                    c.one("").get().then(function(b) {
                        var c = b.data;
                        a.resolve(c)
                    }, function(b) {
                        a.resolve(b)
                    }), f = a.promise
                }
                return f
            },
            m = function() {
                var a = d.defer();
                return c.one("checkoutinfo").get().then(function(b) {
                    var c = b.data;
                    a.resolve(c)
                }, function(b) {
                    a.resolve(b)
                }), a.promise
            },
            n = function() {
                var a = d.defer();
                return c.one("stocksettings").get().then(function(b) {
                    var c = b.data;
                    a.resolve(c)
                }, function(b) {
                    a.resolve(b)
                }), a.promise
            },
            o = function(a) {
                var b = d.defer();
                return c.all("address").customPUT(a).then(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            },
            p = function(a, b, e) {
                var g = d.defer();
                return c.all("").customPUT({
                    TimezoneCode: a,
                    CurrencyCode: b,
                    UnitCode: e
                }).then(function(a) {
                    f = void 0, g.resolve(a)
                }, function(a) {
                    g.resolve(a)
                }), g.promise
            },
            q = function(a) {
                var b = d.defer();
                return c.all("paymentgateways").customPUT(a).then(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            },
            r = function(a) {
                var b = d.defer();
                return c.all("stocksettings").customPUT(a).then(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            };
        return {
            GetCategories: g,
            GetShop: l,
            GetShopCheckoutInfo: m,
            GetShopStockManagementSettings: n,
            UpdateShopAddress: o,
            UpdateShopPaymentGateways: q,
            UpdateShopShippingSettings: function(a) {
                var b = d.defer();
                return c.all("shipping").customPUT(a).then(function(a) {
                    b.resolve(a)
                }, function(a) {
                    b.resolve(a)
                }), b.promise
            },
            SetCurrency: k,
            SetAppCurrencyFromShopSettings: j,
            updateShopLocalSettings: p,
            getCategoryHierarchies: h,
            updateCategoryHierarchies: i,
            UpdateShopStockManagementSettings: r
        }
    }]), angular.module("msShopModules").directive("msTagit", ["$timeout", function(a) {
        return {
            restrict: "A",
            scope: {
                tagsAvailable: "=tagsAvailable"
            },
            require: "?ngModel",
            link: function(b, c, d, e) {
                function f() {
                    var a = c.val();
                    void 0 !== a && a.length && (a = a.split(",")), e.$setViewValue(a)
                }
                e && ($(c).parent().addClass("ui-front"), a(function() {
                    $(c).tagit({
                        availableTags: b.tagsAvailable,
                        itemName: "item",
                        showAutocompleteOnFocus: !0,
                        placeholderText: "Type here...",
                        allowSpaces: !0,
                        onTagExists: function(b, c) {
                            return c.existingTag.addClass("tag-used").attr("data-used-tag", "This tag exists"), a(function() {
                                c.existingTag.removeClass("tag-used")
                            }, 1500), !1
                        },
                        afterTagAdded: function(a, c) {
                            c.duringInitialization || b.$apply(f)
                        },
                        afterTagRemoved: function(a, c) {
                            c.duringInitialization || b.$apply(f)
                        }
                    }).next(".tagit").addClass(d.ngClass), f()
                }, 150, !1))
            }
        }
    }]), angular.module("msShopModules").directive("msToDigit", function() {
        return function(a, b, c) {
            var d = [8, 9, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
            b.bind("keydown", function(a) {
                -1 !== $.inArray(a.which, d) && !0 !== a.shiftKey || a.preventDefault()
            })
        }
    }), angular.module("msShopModules").factory("UnauthorizedInterceptor", ["$q", "$location", function(a, b) {
        return {
            responseError: function(c) {
                return 401 === c.status ? (b.path("/login"), a.reject(c)) : a.reject(c)
            }
        }
    }]), angular.module("msShopModules").directive("msUploadDuplicated", ["$timeout", "Config", "$window", "$sessionStorage", function(a, b, c, d) {
        return {
            restrict: "A",
            scope: {
                files: "=msUpload",
                title: "@msTitle",
                enableMultiple: "=msEnableMultiple"
            },
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msShopModules/upload.html",
            link: function(c, e) {
                function f(a) {
                    switch (c.height = a <= 3 ? "100%" : "50%", a) {
                        case 1:
                            c.cols = 24;
                            break;
                        case 3:
                            c.cols = 8;
                            break;
                        default:
                            c.cols = 12
                    }
                }
                var g = {
                    Authorization: "Bearer " + d.get("token")
                };
                c.$on("fileuploaddone", function(a, b) {
                    b.headers = g;
                    for (var d = b._response.result, e = 0; d[e];) c.files.push({
                        url: d[e].Url
                    }), e++
                }), c.$on("fileuploadadd", function(a, d) {
                    d.headers = g, d.url = b.GetEndPoint("siteApiEndpoint") + "shops/" + d.scope.$parent.$root.shopId + "/upload", c.$parent.fileLoadingClass = " loading", c.fileLoadingError = !1
                }), c.$on("fileuploadstop", function() {
                    c.$parent.fileLoadingClass = ""
                }), c.$on("fileuploadfail", function() {
                    c.$parent.fileLoadingError = !0
                });
                var h;
                c.$on("fileuploaddragover", function() {
                    a(function() {
                        c.$parent.fileDragOverClass = "file-drag-over"
                    }), a.cancel(h), h = a(function() {
                        c.$parent.fileDragOverClass = !1
                    }, 100)
                }), c.$on("fileuploaddrop", function() {
                    c.$parent.fileDragOverClass = !1
                }), c.deleteItem = function(a) {
                    c.files.splice(a, 1)
                };
                var i, j;
                c.setActive = function(b) {
                    0 !== b && (j = e.find(".grid"), i = c.files[b], c.files.splice(b, 1), j.animate({
                        scrollTop: "0"
                    }), a(function() {
                        c.files.unshift(i)
                    }, 300))
                }, c.$watch("files.length", function(a, b) {
                    a !== b && f(a)
                })
            }
        }
    }]), angular.module("msShopModules").factory("UserModel", function() {
        var a = function() {
            var a = this;
            a.UserName = "", a.Password = "", a.PasswordConfirm = ""
        };
        return {
            create: function(b) {
                if (void 0 === b) return new a;
                var c = new a;
                return c.UserName = b.name, c
            }
        }
    }), angular.module("msShopModules").factory("UserService", ["Restangular", "HelperService", "$window", "$sessionStorage", function(a, b, c, d) {
        var e = {};
        return d.put("token", void 0), e.register = function(b) {
            return a.all("account/register").post(b, {})
        }, e.login = function(b) {
            var c = "grant_type=password&username=" + b.UserName + "&password=" + b.Password;
            return a.all("token").post(c, {
                "Content-Type": "application/x-www-form-urlencoded"
            })
        }, e
    }]), angular.module("msShopModules").factory("VariantService", ["ShopRestangular", "$q", function(a, b) {
        return {
            Generate: function(c) {
                var d = c,
                    e = b.defer();
                return a.all("variants").post(d, {}).then(function(a) {
                    e.resolve(a)
                }, function(a) {
                    e.resolve(a)
                }), e.promise
            },
            Regenerate: function(c, d) {
                var e = d,
                    f = b.defer();
                return a.all("products/" + c + "/regeneratevariants").post(e, {}).then(function(a) {
                    f.resolve(a)
                }, function(a) {
                    f.resolve(a)
                }), f.promise
            }
        }
    }]), angular.module("msShopModules").directive("msVersionDuplicated", ["$http", "AppVersionService", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: !1,
            template: "<span>We're running </br> API Version: {{ version.api.build }} </br>  APP Version: {{ version.app.build }} </span>",
            link: function(a) {
                var c = {};
                b.getAppVersion(function(a) {
                    c.app = {
                        build: a
                    }
                }), b.getApiVersion(function(b) {
                    c.api = b, a.version = c
                })
            }
        }
    }]),
    function(a) {
        a.widget("ui.tagit", {
            options: {
                allowDuplicates: !1,
                caseSensitive: !0,
                fieldName: "tags",
                placeholderText: null,
                readOnly: !1,
                removeConfirmation: !1,
                tagLimit: null,
                availableTags: [],
                autocomplete: {},
                showAutocompleteOnFocus: !1,
                allowSpaces: !1,
                singleField: !1,
                singleFieldDelimiter: ",",
                singleFieldNode: null,
                animate: !0,
                tabIndex: null,
                beforeTagAdded: null,
                afterTagAdded: null,
                beforeTagRemoved: null,
                afterTagRemoved: null,
                onTagClicked: null,
                onTagLimitExceeded: null,
                onTagAdded: null,
                onTagRemoved: null,
                tagSource: null
            },
            _create: function() {
                var b = this;
                this.element.is("input") ? (this.tagList = a("<ul></ul>").insertAfter(this.element), this.options.singleField = !0, this.options.singleFieldNode = this.element, this.element.addClass("tagit-hidden-field")) : this.tagList = this.element.find("ul, ol").andSelf().last(), this.tagInput = a('<input type="text" />').addClass("ui-widget-content"), this.options.readOnly && this.tagInput.attr("disabled", "disabled"), this.options.tabIndex && this.tagInput.attr("tabindex", this.options.tabIndex), this.options.placeholderText && this.tagInput.attr("placeholder", this.options.placeholderText), this.options.autocomplete.source || (this.options.autocomplete.source = function(b, c) {
                    var d = b.term.toLowerCase(),
                        e = a.grep(this.options.availableTags, function(a) {
                            return 0 === a.toLowerCase().indexOf(d)
                        });
                    this.options.allowDuplicates || (e = this._subtractArray(e, this.assignedTags())), c(e)
                }), this.options.showAutocompleteOnFocus && (this.tagInput.focus(function(a, c) {
                    b._showAutocomplete()
                }), void 0 === this.options.autocomplete.minLength && (this.options.autocomplete.minLength = 0)), a.isFunction(this.options.autocomplete.source) && (this.options.autocomplete.source = a.proxy(this.options.autocomplete.source, this)), a.isFunction(this.options.tagSource) && (this.options.tagSource = a.proxy(this.options.tagSource, this)), this.tagList.addClass("tagit").addClass("ui-widget ui-widget-content ui-corner-all").append(a('<li class="tagit-new"></li>').append(this.tagInput)).click(function(c) {
                    var d = a(c.target);
                    if (d.hasClass("tagit-label")) {
                        var e = d.closest(".tagit-choice");
                        e.hasClass("removed") || b._trigger("onTagClicked", c, {
                            tag: e,
                            tagLabel: b.tagLabel(e)
                        })
                    } else b.tagInput.focus()
                });
                var c = !1;
                if (this.options.singleField)
                    if (this.options.singleFieldNode) {
                        var d = a(this.options.singleFieldNode),
                            e = d.val().split(this.options.singleFieldDelimiter);
                        d.val(""), a.each(e, function(a, d) {
                            b.createTag(d, null, !0), c = !0
                        })
                    } else this.options.singleFieldNode = a('<input type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />'), this.tagList.after(this.options.singleFieldNode);
                if (c || this.tagList.children("li").each(function() {
                        a(this).hasClass("tagit-new") || (b.createTag(a(this).text(), a(this).attr("class"), !0), a(this).remove())
                    }), this.tagInput.keydown(function(c) {
                        if (c.which == a.ui.keyCode.BACKSPACE && "" === b.tagInput.val()) {
                            var d = b._lastTag();
                            !b.options.removeConfirmation || d.hasClass("remove") ? b.removeTag(d) : b.options.removeConfirmation && d.addClass("remove ui-state-highlight")
                        } else b.options.removeConfirmation && b._lastTag().removeClass("remove ui-state-highlight");
                        (c.which === a.ui.keyCode.COMMA && !1 === c.shiftKey || c.which === a.ui.keyCode.ENTER || c.which == a.ui.keyCode.TAB && "" !== b.tagInput.val() || c.which == a.ui.keyCode.SPACE && !0 !== b.options.allowSpaces && ('"' != a.trim(b.tagInput.val()).replace(/^s*/, "").charAt(0) || '"' == a.trim(b.tagInput.val()).charAt(0) && '"' == a.trim(b.tagInput.val()).charAt(a.trim(b.tagInput.val()).length - 1) && a.trim(b.tagInput.val()).length - 1 != 0)) && (c.which === a.ui.keyCode.ENTER && "" === b.tagInput.val() || c.preventDefault(), b.options.autocomplete.autoFocus && b.tagInput.data("autocomplete-open") || (b.tagInput.autocomplete("close"), b.createTag(b._cleanedInput())))
                    }).blur(function(a) {
                        b.tagInput.data("autocomplete-open") || b.createTag(b._cleanedInput())
                    }), this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
                    var f = {
                        select: function(a, c) {
                            return b.createTag(c.item.value), !1
                        }
                    };
                    a.extend(f, this.options.autocomplete), f.source = this.options.tagSource || f.source, this.tagInput.autocomplete(f).bind("autocompleteopen.tagit", function(a, c) {
                        b.tagInput.data("autocomplete-open", !0)
                    }).bind("autocompleteclose.tagit", function(a, c) {
                        b.tagInput.data("autocomplete-open", !1)
                    }), this.tagInput.autocomplete("widget").addClass("tagit-autocomplete")
                }
            },
            destroy: function() {
                return a.Widget.prototype.destroy.call(this), this.element.unbind(".tagit"), this.tagList.unbind(".tagit"), this.tagInput.removeData("autocomplete-open"), this.tagList.removeClass(["tagit", "ui-widget", "ui-widget-content", "ui-corner-all", "tagit-hidden-field"].join(" ")), this.element.is("input") ? (this.element.removeClass("tagit-hidden-field"), this.tagList.remove()) : (this.element.children("li").each(function() {
                    a(this).hasClass("tagit-new") ? a(this).remove() : (a(this).removeClass(["tagit-choice", "ui-widget-content", "ui-state-default", "ui-state-highlight", "ui-corner-all", "remove", "tagit-choice-editable", "tagit-choice-read-only"].join(" ")), a(this).text(a(this).children(".tagit-label").text()))
                }), this.singleFieldNode && this.singleFieldNode.remove()), this
            },
            _cleanedInput: function() {
                return a.trim(this.tagInput.val().replace(/^"(.*)"$/, "$1"))
            },
            _lastTag: function() {
                return this.tagList.find(".tagit-choice:last:not(.removed)")
            },
            _tags: function() {
                return this.tagList.find(".tagit-choice:not(.removed)")
            },
            assignedTags: function() {
                var b = this,
                    c = [];
                return this.options.singleField ? (c = a(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter), "" === c[0] && (c = [])) : this._tags().each(function() {
                    c.push(b.tagLabel(this))
                }), c
            },
            _updateSingleTagsField: function(b) {
                a(this.options.singleFieldNode).val(b.join(this.options.singleFieldDelimiter)).trigger("change")
            },
            _subtractArray: function(b, c) {
                for (var d = [], e = 0; e < b.length; e++) - 1 == a.inArray(b[e], c) && d.push(b[e]);
                return d
            },
            tagLabel: function(b) {
                return this.options.singleField ? a(b).find(".tagit-label:first").text() : a(b).find("input:first").val()
            },
            _showAutocomplete: function() {
                this.tagInput.autocomplete("search", "")
            },
            _findTagByLabel: function(b) {
                var c = this,
                    d = null;
                return this._tags().each(function(e) {
                    if (c._formatStr(b) == c._formatStr(c.tagLabel(this))) return d = a(this), !1
                }), d
            },
            _isNew: function(a) {
                return !this._findTagByLabel(a)
            },
            _formatStr: function(b) {
                return this.options.caseSensitive ? b : a.trim(b.toLowerCase())
            },
            _effectExists: function(b) {
                return Boolean(a.effects && (a.effects[b] || a.effects.effect && a.effects.effect[b]))
            },
            createTag: function(b, c, d) {
                var e = this;
                if (b = a.trim(b), this.options.preprocessTag && (b = this.options.preprocessTag(b)), "" === b) return !1;
                if (!this.options.allowDuplicates && !this._isNew(b)) {
                    var f = this._findTagByLabel(b);
                    return !1 !== this._trigger("onTagExists", null, {
                        existingTag: f,
                        duringInitialization: d
                    }) && this._effectExists("highlight") && f.effect("highlight"), !1
                }
                if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) return this._trigger("onTagLimitExceeded", null, {
                    duringInitialization: d
                }), !1;
                var g = a(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(b),
                    h = a("<li></li>").addClass("tagit-choice ui-widget-content ui-state-default ui-corner-all").addClass(c).append(g);
                if (this.options.readOnly) h.addClass("tagit-choice-read-only");
                else {
                    h.addClass("tagit-choice-editable");
                    var i = a("<span></span>").addClass("ui-icon ui-icon-close"),
                        j = a('<a><span class="text-icon">\xd7</span></a>').addClass("tagit-close").append(i).click(function(a) {
                            e.removeTag(h)
                        });
                    h.append(j)
                }
                if (!this.options.singleField) {
                    var k = g.html();
                    h.append('<input type="hidden" value="' + k + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />')
                }
                if (!1 !== this._trigger("beforeTagAdded", null, {
                        tag: h,
                        tagLabel: this.tagLabel(h),
                        duringInitialization: d
                    })) {
                    if (this.options.singleField) {
                        var l = this.assignedTags();
                        l.push(b), this._updateSingleTagsField(l)
                    }
                    this._trigger("onTagAdded", null, h), this.tagInput.val(""), this.tagInput.parent().before(h), this._trigger("afterTagAdded", null, {
                        tag: h,
                        tagLabel: this.tagLabel(h),
                        duringInitialization: d
                    }), this.options.showAutocompleteOnFocus && !d && setTimeout(function() {
                        e._showAutocomplete()
                    }, 0)
                }
            },
            removeTag: function(b, c) {
                if (c = void 0 === c ? this.options.animate : c, b = a(b), this._trigger("onTagRemoved", null, b), !1 !== this._trigger("beforeTagRemoved", null, {
                        tag: b,
                        tagLabel: this.tagLabel(b)
                    })) {
                    if (this.options.singleField) {
                        var d = this.assignedTags(),
                            e = this.tagLabel(b);
                        d = a.grep(d, function(a) {
                            return a != e
                        }), this._updateSingleTagsField(d)
                    }
                    if (c) {
                        b.addClass("removed");
                        var f = this._effectExists("blind") ? ["blind", {
                                direction: "horizontal"
                            }, "fast"] : ["fast"],
                            g = this;
                        f.push(function() {
                            b.remove(), g._trigger("afterTagRemoved", null, {
                                tag: b,
                                tagLabel: g.tagLabel(b)
                            })
                        }), b.fadeOut("fast").hide.apply(b, f).dequeue()
                    } else b.remove(), this._trigger("afterTagRemoved", null, {
                        tag: b,
                        tagLabel: this.tagLabel(b)
                    })
                }
            },
            removeTagByLabel: function(a, b) {
                var c = this._findTagByLabel(a);
                if (!c) throw "No such tag exists with the name '" + a + "'";
                this.removeTag(c, b)
            },
            removeAll: function() {
                var a = this;
                this._tags().each(function(b, c) {
                    a.removeTag(c, !1)
                })
            }
        })
    }(jQuery), angular.module("msContentItemShop", ["msBasketManager", "msShopModules"]), angular.module("msContentItemShop").filter("paginate", function() {
        return function(a, b) {
            var c = [];
            if (!a) return c;
            b = b || {}, b.page = b.page || 0, b.pageSize = b.pageSize || 6;
            var d = b.page * b.pageSize,
                e = d + b.pageSize;
            b.pages = [];
            var f = Math.ceil(a.length / b.pageSize);
            b.page = Math.max(0, b.page), b.page = Math.min(f - 1, b.page);
            for (var g = 0; g < f; g++) b.pages.push(g);
            for (var h = d; a[h] && h < e; h++) c.push(a[h]);
            return c
        }
    }), angular.module("msContentItemShop").directive("msShopAddToCart", ["BasketManager", "Config", function(a, b) {
        return {
            restrict: "AE",
            replace: !0,
            scope: {
                product: "=",
                variant: "=",
                disabled: "=",
                showRemove: "@"
            },
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msContentItemShop/msShopAddToCart.tpl.html",
            link: function(b, c, d) {
                b.setShowQuantityHigherThanStockLevelMessage = function(a) {
                    b.$parent && b.$parent.useStockLevels && (!1 === b.$parent.allowOutOfStockOrders && a > b.variant.StockLevel ? b.variant.showQuantityHigherThanStockLevelMessage = !0 : !1 === b.$parent.allowOutOfStockOrders && (b.variant.showQuantityHigherThanStockLevelMessage = !1))
                };
                var e = function() {
                    if (!b.product) return b.item = b.product, void(b.$parent.productVariant && (b.$parent.productVariant.Quantity = b.item.quantity));
                    var c = b.product.id;
                    if (b.variant && b.variant.VariantId && (c = b.variant.VariantId), c) {
                        b.item = a.getItemById(c);
                        var d = b.item ? b.item.quantity : b.variant.Quantity;
                        b.setShowQuantityHigherThanStockLevelMessage(d), b.showVariantMessage = !1
                    } else b.showVariantMessage = !0
                };
                b.removeFromBasket = function(b) {
                    a.deleteItem(b.id)
                }, b.increaseQuantity = function(a) {
                    a.quantity++, b.$parent.productVariant && (b.$parent.productVariant.Quantity = a.quantity), b.setShowQuantityHigherThanStockLevelMessage(a.quantity)
                }, b.decreaseQuantity = function(a) {
                    var c = a.quantity - 1;
                    0 === c ? b.removeFromBasket(a) : a.quantity = c, b.$parent.productVariant && (b.$parent.productVariant.Quantity = a.quantity), b.setShowQuantityHigherThanStockLevelMessage(a.quantity)
                }, b.$watch("product", function() {
                    e()
                }), b.$watch("variant", function() {
                    e()
                }), b.$watch("item.quantity", function(a, c) {
                    null !== a && 0 === a && c !== a && (e(), b.item && b.removeFromBasket(b.item))
                }), b.addToCart = function(c, d) {
                    d || (d = 1, b.$parent.productVariant && (b.$parent.productVariant.Quantity = d)), a.addItem(b.variant.VariantId, c.Name, c.Images[0], d, b.variant.Price, b.variant.AttributeOptions, b.variant.StockLevel).then(function() {
                        e()
                    })
                }
            }
        }
    }]), angular.module("msContentItemShop").directive("msContentItemShopCategory", ["$compile", "ShopService", "Config", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            template: "<div></div>",
            link: function(d, e) {
                var f = function(a) {
                        var b = a.param1,
                            c = "ms-content-item-shop-product-list";
                        switch (b) {
                            case "products":
                                d.$emit("maincontentItem", {
                                    context: "shop",
                                    type: "product",
                                    id: a.param2
                                }), c = "ms-content-item-shop-product";
                                break;
                            case "basket":
                                d.$emit("maincontentItem", {
                                    context: "shop",
                                    type: "basket"
                                }), c = "ms-content-item-shop-basket";
                                break;
                            case "categories":
                                d.$emit("maincontentItem", {
                                    context: "shop",
                                    type: "category",
                                    id: a.param2
                                }), c = "ms-content-item-shop-product-list";
                                break;
                            default:
                                c = "ms-content-item-shop-product-list"
                        }
                        return '<div><div ng-hide="!contentItemMetaData.loading" style="position: absolute;margin-left: 50%;margin-top: 10%;">Loading...</div><div ' + c + ' content-item-data="contentItemData" content-item-meta-data="contentItemMetaData"></div></div>'
                    },
                    g = function() {
                        var a = c.GetEndPoint("modulesDirectory") + "/msContentItemShop/shop.css";
                        $('link[href="' + a + '"]').length || $("head").append('<link href="' + a + '" type="text/css" rel="stylesheet" />')
                    },
                    h = function() {
                        b.GetShop().then(function(a) {
                            var c;
                            a.Currency && a.Currency.Symbol && (c = a.Currency.Symbol);
                            var d = {
                                symbol: c || "\xa3"
                            };
                            b.SetCurrency(d), i()
                        })
                    },
                    i = function() {
                        a(f((d.contentItemMetaData || {}).urlParams))(d, function(a) {
                            e.html(a)
                        })
                    };
                g(), h()
            }
        }
    }]), angular.module("msContentItemShopBasket", ["msBasketManager", "msShopModules"]), angular.module("msContentItemShopBasket").directive("msContentItemShopBasket", ["$compile", "OrderService", "ShopService", "BasketManager", "Config", "$window", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: e.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopBasket/msShopBasket.tpl.html",
            link: function(a, g, h) {
                a.svgUrl = function(a) {
                    return e.GetEndPoint("modulesDirectory") + "/msContentItemShop/sprites.svg#" + a
                }, a.checkoutInfo = {
                    HasPaymentGateway: !0
                }, a.disableCheckoutButtons = !1, a.cartItemQuantityHigherThanAvailableStock = !1;
                var i = function(b) {
                    if (a.stockSettings && a.stockSettings.UseStockLevels) {
                        for (var c = !1, d = 0; d < b.length; d++) {
                            var e = b[d];
                            if (e.quantity > e.stockLevel) {
                                c = !0;
                                break
                            }
                        }
                        a.cartItemQuantityHigherThanAvailableStock = c, a.disableCheckoutButtons = !a.stockSettings.EnableBuyButtonWhenProductOutOfStock && !0 === a.cartItemQuantityHigherThanAvailableStock
                    }
                };
                c.GetShopCheckoutInfo().then(function(b) {
                    a.checkoutInfo = b
                }), c.GetShopStockManagementSettings().then(function(b) {
                    a.stockSettings = b, a.cart && i(a.cart)
                }), a.goToCheckout = function() {
                    a.disableCheckoutButtons || b.createOrder(a.cart).then(function(a) {
                        if (!a || 500 !== a.status) {
                            var b = e.GetEndPoint("checkoutEndpoint"),
                                c = e.GetSessionStoredValue("siteId");
                            d.emptyBasket(), f.location.href = b + "Checkout/Index/" + c + "/" + a
                        }
                    })
                }, a.checkoutWithPayPal = function() {
                    a.disableCheckoutButtons || b.createOrder(a.cart).then(function(a) {
                        if (!a || 500 !== a.status) {
                            var b = e.GetEndPoint("checkoutEndpoint"),
                                c = e.GetSessionStoredValue("siteId");
                            d.emptyBasket(), f.location.href = b + "Checkout/Ecs/" + c + "/" + a
                        }
                    })
                }, a.removeItem = function(a) {
                    d.deleteItem(a.id)
                }, a.goToShop = function() {
                    a.contentItemMetaData.setUrlParamsByPageType("shop")
                };
                var j = function(b) {
                    for (var c = 0, d = 0; b && b[d]; d++) {
                        var e = b[d],
                            f = e.quantity * e.price;
                        c += Math.round(100 * f) / 100
                    }
                    a.total = Math.round(100 * c) / 100
                };
                a.$watch("cart", function(a) {
                    j(a), i(a)
                }, !0), d.listItems().then(function(b) {
                    a.cart = b, i(b)
                })
            }
        }
    }]), angular.module("msContentItemShopMiniCart", ["msBasketManager", "msShopModules"]), angular.module("msContentItemShopMiniCart").directive("msContentItemShopMiniBasket", ["BasketManager", "Config", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: b.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopMiniCart/msShopMiniCart.tpl.html",
            link: function(c, d, e) {
                var f = function(a) {
                        for (var b = 0, d = 0; a && a[d]; d++) {
                            var e = a[d],
                                f = e.quantity * e.price;
                            b += Math.round(100 * f) / 100
                        }
                        c.total = Math.round(100 * b) / 100
                    },
                    g = function(a) {
                        for (var b = 0, d = 0; a && d < a.length; d++) {
                            b += a[d].quantity
                        }
                        c.cartSize = b
                    };
                c.svgUrl = function(a) {
                    return b.GetEndPoint("modulesDirectory") + "/msContentItemShop/sprites.svg#" + a
                }, c.$watch("cart", function(a) {
                    f(a), g(a)
                }, !0), a.listItems().then(function(a) {
                    c.cart = a
                }), c.showCartAction = function() {
                    c.contentItemMetaData.setUrlParamsByPageType("shop", "basket")
                }, d.on("click", function() {
                    $(window).width() <= 640 && (c.showCartAction(), c.$apply())
                })
            }
        }
    }]), angular.module("msContentItemShopProduct", ["msBasketManager", "msShopModules"]), angular.module("msContentItemShopProduct").directive("msContentItemShopProduct", ["$compile", "ShopService", "ProductService", "Config", "$sce", "msLightbox", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: d.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopProduct/msShopProduct.tpl.html",
            link: function(a, d) {
                a.back = function() {
                    a.contentItemMetaData.setUrlParamsByPageType("shop")
                }, b.GetShop().then(function(b) {
                    a.unit = b.Unit, a.useStockLevels = b.StockSettings.UseStockLevels, a.hideOutOfStockProducts = b.StockSettings.HideProductWhenOutOfStock, a.allowOutOfStockOrders = b.StockSettings.EnableBuyButtonWhenProductOutOfStock, a.showStockLevel = b.StockSettings.ShowStockLevel, a.outOfStockOrdersMessage = b.StockSettings.OutOfStockOrdersMessage
                });
                var g = function(a) {
                        return "_" + a + "_"
                    },
                    h = [];
                a.productVariant = void 0;
                var i = function(a, b) {
                    if (a && b)
                        for (var c = 0; a[c]; c++) {
                            for (var d = a[c], e = !0, f = 0; d.AttributeOptions[f]; f++) {
                                var h = d.AttributeOptions[f],
                                    i = g(h.Key);
                                if (b[i] !== h.Value) {
                                    e = !1;
                                    break
                                }
                            }
                            if (e) return d
                        }
                };
                a.checkValues = function(b, c) {
                    if (a.product) {
                        if (b) {
                            var d = g(b);
                            h[d] = c
                        }
                        a.productVariant = i(a.product.Variants, h), a.productVariant ? a.disableAddtoCartButton = a.useStockLevels && !a.allowOutOfStockOrders && 0 === a.productVariant.StockLevel : a.useStockLevels
                    }
                };
                var j = function() {
                        if (a.product)
                            if (a.product.Variants) {
                                for (var b = a.product.Variants[0].Price, c = a.product.Variants[0].Price, d = 0; d < a.product.Variants.length; d++) {
                                    var e = a.product.Variants[d];
                                    e.Price < b && (b = e.Price), e.Price > c && (c = e.Price)
                                }
                                a.product.PriceRange = {
                                    Min: b,
                                    Max: c,
                                    Same: b === c
                                }
                            } else a.product.PriceRange = {}
                    },
                    k = function(b, c) {
                        for (var d = a.product.Variants, e = 0; d[e]; e++)
                            for (var f = d[e], g = 0; g < f.AttributeOptions.length; g++) {
                                var h = f.AttributeOptions[g];
                                if (h.Key === b && h.Value === c && f.StockLevel > 0) return !1
                            }
                        return !0
                    },
                    l = function(a) {
                        a.resetForCurrentSelection = function() {
                            for (var a = 0; a < this.Options.length; a++) this.Options[a].resetForCurrentSelection()
                        }
                    },
                    m = function(a) {
                        a.resetForCurrentSelection = function() {
                            this.outOfStockForCurrentSelection = !1
                        }
                    },
                    n = function() {
                        if (!a.useStockLevels) return void(a.stockAwareProductAttributes = {
                            attributes: {
                                collection: []
                            },
                            resetForCurrentSelection: function() {},
                            findByAttributeNameAndValue: function(a, b) {}
                        });
                        a.stockAwareProductAttributes = {
                            attributes: {
                                collection: angular.copy(a.product.Attributes),
                                resetForCurrentSelection: function() {
                                    for (var a = 0; a < this.collection.length; a++) this.collection[a].resetForCurrentSelection()
                                },
                                setOutOfStockForCurrentSelectionByAttributeNameAndValue: function(a, b) {
                                    for (var c, d = 0; d < this.collection.length; d++)
                                        if (this.collection[d].Name === a) {
                                            c = this.collection[d];
                                            break
                                        } if (c)
                                        for (var e = c.Options, f = 0; f < e.length; f++)
                                            if (e[f] === b) {
                                                e[f].outOfStockForCurrentSelection = !0;
                                                break
                                            }
                                }
                            }
                        };
                        for (var b = 0; b < a.stockAwareProductAttributes.attributes.collection.length; b++) l(a.stockAwareProductAttributes.attributes.collection[b]);
                        for (var c = 0; c < a.stockAwareProductAttributes.attributes.collection.length; c++)
                            for (var d = a.stockAwareProductAttributes.attributes.collection[c], e = 0; e < d.Options.length; e++) {
                                var f = d.Options[e];
                                d.Options[e] = {
                                    value: f,
                                    allOutOfStock: k(d.Name, f),
                                    outOfStockForCurrentSelection: !1
                                }, m(d.Options[e])
                            }
                    },
                    o = function(b) {
                        if (!b) return void(a.error = "Product not defined");
                        a.contentItemMetaData.loading = !0, c.get(b).then(function(b) {
                            if (h = [], a.contentItemMetaData.loading = !1, delete a.error, delete a.product, b.status) a.error = "Error product not found";
                            else {
                                a.product = b;
                                var c = angular.copy(a.product.Images);
                                a.product.Images = [];
                                for (var d = 0; d < c.length; d++) {
                                    var f = c[d];
                                    f && a.product.Images.push(f)
                                }
                                a.product.Description = e.trustAsHtml(a.product.Description), n(), a.checkValues(), j()
                            }
                        })
                    },
                    p = "shop-product" === a.contentItemData.type;
                a.openImage = function(b) {
                    f.open({
                        items: a.product.Images,
                        index: b,
                        position: "bottom"
                    })
                };
                var q;
                a.showLeftBar = !0, a.showBackToShopButton = !0, p ? (a.$watch("contentItemData.settings.productId", function(a) {
                    o(a)
                }), a.showLeftBar = !1, a.showBackToShopButton = !1) : a.contentItemMetaData && a.contentItemMetaData.urlParams && a.contentItemMetaData.urlParams.param2 && (q = a.contentItemMetaData.urlParams.param2, o(q))
            }
        }
    }]), angular.module("msContentItemShopProduct").directive("msContentItemShopProductSettings", ["$compile", "ProductService", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Product Id</label><select ng-model="settings.productId" ng-options="product.ProductId as product.Name for product in products"><option>--Choose a product--</option></select></div></div></div>',
            link: function(a, c) {
                b.getAll().then(function(b) {
                    a.products = b
                })
            }
        }
    }]), angular.module("msContentItemShopProductList", ["msBasketManager", "msShopModules"]), angular.module("msContentItemShopProductList").directive("msShopSearch", ["Config", function(a) {
        return {
            restrict: "AE",
            replace: !0,
            scope: {
                searchText: "=",
                category: "="
            },
            templateUrl: a.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopProductList/msShopSearch.tpl.html",
            link: function(b, c, d) {
                b.svgUrl = function(b) {
                    return a.GetEndPoint("modulesDirectory") + "/msContentItemShop/sprites.svg#" + b
                };
                var e = c.find("div.title") || c;
                e && e.length || (e = c), e.on("click", function(a) {
                    $(window).width() <= 640 && (c.toggleClass("open"), $("aside .mini-cart, aside .categories").toggleClass("hide"))
                })
            }
        }
    }]), angular.module("msContentItemShopProductList").directive("msShopCategoryList", ["Config", "$timeout", function(a, b) {
        return {
            restrict: "AE",
            replace: !0,
            scope: {
                categories: "=",
                callback: "="
            },
            templateUrl: a.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopProductList/msShopCategoryList.tpl.html",
            link: function(b, c, d) {
                b.svgUrl = function(b) {
                    return a.GetEndPoint("modulesDirectory") + "/msContentItemShop/sprites.svg#" + b
                };
                var e = "";
                b.selectCategory = function(a, c) {
                    e = a, b.callback && b.callback(a, c), $(window).width() <= 640 && ($("aside .mini-cart, aside .search, aside .categories").removeClass("hide"), $("aside .search, aside .categories").removeClass("open"))
                }, b.toggleChildren = function(a) {
                    b && b.$parent && b.$parent.toggleChildren && b.$parent.toggleChildren(a)
                }, c.on("click", function() {
                    $(window).width() <= 640 && (c.toggleClass("open"), $("aside .mini-cart, aside .search").toggleClass("hide"))
                })
            }
        }
    }]), angular.module("msContentItemShopProductList").directive("msContentItemShopProductList", ["$compile", "ProductService", "ShopService", "Config", function(a, b, c, d) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: d.GetSessionStoredValue("modulesDirectory") + "/msContentItemShopProductList/msContentItemShopProductList.tpl.html",
            link: function(a, d) {
                a.paging = {}, a.selectProduct = function(b) {
                    a.contentItemMetaData.setUrlParamsByPageType("shop", "products", (b || {}).ProductId)
                }, a.selectCategory = function(b, c) {
                    var d = "categories";
                    "All" === b && (b = void 0, d = void 0), a.contentItemMetaData.setUrlParamsByPageType("shop", d, b, c)
                };
                var e = function() {
                    if (a.contentItemMetaData.urlParams.param2) {
                        var b = [a.contentItemMetaData.urlParams.param2];
                        a.contentItemMetaData.urlParams.param3 && b.push(a.contentItemMetaData.urlParams.param3), a.contentItemMetaData.urlParams.param4 && b.push(a.contentItemMetaData.urlParams.param4), a.categoryFilters = b
                    }
                };
                a.customSearch = function(b) {
                    if (a.categoryFilters && "string" == typeof a.categoryFilters && a.categoryFilters.length > 0 && -1 === b.Categories.indexOf(a.categoryFilters)) return !1;
                    if (a.categoryFilters && "string" != typeof a.categoryFilters && a.categoryFilters.length > 0)
                        for (var c = 0; a.categoryFilters[c]; c++)
                            if (-1 === b.Categories.indexOf(a.categoryFilters[c])) return !1;
                    if (!a.searchText || 0 === a.searchText.length) return !0;
                    var d = a.searchText.toLowerCase();
                    return b.Name.toLowerCase().indexOf(d) >= 0 || !!(b.Description && b.Description.toLowerCase().indexOf(d) >= 0)
                };
                var f = function() {
                        a.products && angular.forEach(a.products, function(a) {
                            if (a.Variants) {
                                for (var b = a.Variants[0].Price, c = a.Variants[0].Price, d = 0; d < a.Variants.length; d++) {
                                    var e = a.Variants[d];
                                    e.Price < b && (b = e.Price), e.Price > c && (c = e.Price)
                                }
                                a.PriceRange = {
                                    Min: b,
                                    Max: c,
                                    Same: b === c
                                }
                            } else a.PriceRange = {}
                        })
                    },
                    g = function() {
                        a.contentItemMetaData.loading = !0, b.getAll().then(function(b) {
                            a.contentItemMetaData.loading = !1, a.products = b, f()
                        })
                    },
                    h = function() {
                        c.getCategoryHierarchies().then(function(b) {
                            b.unshift({
                                name: "All",
                                children: []
                            }), a.categories = b;
                            for (var c = 0; c < a.categories.length; c++) a.categories[c].expanded = !1
                        })
                    };
                a.toggleChildren = function(b) {
                    if (b)
                        for (var c = 0; c < a.categories.length; c++) a.categories[c].name !== b ? a.categories[c].expanded = !1 : a.categories[c].expanded = !a.categories[c].expanded
                }, e(), g(), h()
            }
        }
    }]), angular.module("msBlogRepository", ["msRestangular"]), angular.module("msBlogRepository").factory("BlogRepository", ["BaseBlogRestangular", "BlogRestangular", "$q", "$moment", function(a, b, c, d) {
        var e, f = function(b) {
                var d = c.defer();
                return a.all("").post(b).then(function(a) {
                    d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            g = function(a) {},
            h = function() {
                var a = c.defer();
                return b.one("").get().then(function(b) {
                    var c = b.data;
                    g(c), a.resolve(c)
                }), a.promise
            },
            i = function(a) {
                var d = c.defer();
                return b.all("").customPUT(a).then(function(a) {
                    d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            j = function(a) {
                var d = c.defer();
                return b.all("posts").post(a).then(function(a) {
                    e = void 0, d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            },
            k = function(a) {
                var d = c.defer();
                return b.one("posts", a).get().then(function(a) {
                    var b = a.data;
                    g(b), d.resolve(b)
                }), d.promise
            },
            l = function(a) {
                return m().then(function(b) {
                    for (var c = 0; b[c]; c++)
                        if (b[c].PostId === a) return b[c];
                    return k(a)
                })
            },
            m = function() {
                var a = c.defer();
                return e || (e = b.one("posts", "").get()), e.then(function(b) {
                    var c = [];
                    b && b.data && b.data.ResourceList && (c = b.data.ResourceList), a.resolve(c)
                }), a.promise
            };
        return {
            createBlog: f,
            getBlog: h,
            updateBlog: i,
            convertBlogDates: g,
            createPost: j,
            getPost: l,
            getAllPosts: m,
            updatePost: function(a, d) {
                var f = c.defer();
                return b.all("posts/" + a).customPUT(d).then(function(a) {
                    e = void 0, f.resolve(a)
                }, function(a) {
                    f.resolve(a)
                }), f.promise
            },
            removePost: function(a) {
                var d = c.defer();
                return b.one("posts").customDELETE(a).then(function(a) {
                    e = void 0, d.resolve(a)
                }, function(a) {
                    d.resolve(a)
                }), d.promise
            }
        }
    }]), angular.module("msContentItemBlogPost", ["msBlogRepository"]), angular.module("msContentItemBlogPost").directive("msContentItemBlogPost", ["$compile", "BlogRepository", "Config", "DiscussionRepository", "$moment", function(a, b, c, d, e) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msContentItemBlogPost/msBlogPost.tpl.html",
            link: function(a, f) {
                a.svgUrl = function(a) {
                    return c.GetEndPoint("modulesDirectory") + "/msContentItemBlog/sprites.svg#" + a
                }, a.back = function() {
                    a.contentItemMetaData.setUrlParamsByPageType("blog")
                };
                var g, h = function(c) {
                        if (!c) return void(a.error = "Blog post not defined.");
                        a.contentItemMetaData.loading = !0, b.getPost(c).then(function(c) {
                            a.contentItemMetaData.loading = !1, delete a.error, delete a.product, c.status ? a.error = "Error blog post not found." : (a.blogPost = c, c.theDate = e(c.Created).format("MMMM Do YYYY"), d.getAllComments(c.DiscussionId).then(function(b) {
                                a.blogPost.totalComments = b.length
                            }), b.getBlog(c.BlogId).then(function(b) {
                                delete a.error, delete a.product, c.status ? a.error = "Error blog post not found." : a.blog = b
                            }))
                        })
                    },
                    i = "blog-post" === a.contentItemData.type;
                a.showLeftBar = !0, a.showBackToShopButton = !0, i ? (a.$watch("contentItemData.settings.blogPostId", function(a) {
                    h(a)
                }), a.showLeftBar = !1, a.showBackToShopButton = !1) : a.contentItemMetaData && a.contentItemMetaData.urlParams && a.contentItemMetaData.urlParams.param2 ? (g = a.contentItemMetaData.urlParams.param2, h(g)) : a.error = "Blog post not found."
            }
        }
    }]), angular.module("msContentItemBlogPost").directive("msContentItemBlogPostSettings", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>Product Id</label><select ng-model="settings.productId" ng-options="product.ProductId as product.Name for product in products"><option>--Choose a product--</option></select></div></div></div>',
            link: function(a, b) {}
        }
    }]), angular.module("msContentItemBlogPostList", ["msBlogRepository"]), angular.module("msContentItemBlogPostList").directive("msContentItemBlogPostList", ["$compile", "BlogRepository", "Config", "DiscussionRepository", "$moment", function(a, b, c, d, e) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msContentItemBlogPostList/msContentItemBlogPostList.tpl.html",
            link: function(a, f) {
                a.paging = {}, a.selectBlogPost = function(b) {
                        a.contentItemMetaData.setUrlParamsByPageType("blog", "post", (b || {}).PostId)
                    }, a.svgUrl = function(a) {
                        return c.GetEndPoint("modulesDirectory") + "/msContentItemBlog/sprites.svg#" + a
                    }, a.customSearch = function(b) {
                        if (b) {
                            if (!a.searchText || "" === a.searchText) return !0;
                            var c = a.searchText.toLowerCase(),
                                d = new RegExp(c, "i");
                            if (b.Title && b.Title.search(d) >= 0) return !0;
                            if (b.Content && b.Content.search(d) >= 0) return !0;
                            if (b.Author && b.Author.search(d) >= 0) return !0
                        }
                        return !1
                    }, a.paging = {},
                    function() {
                        a.contentItemMetaData.loading = !0, b.getBlog().then(function(b) {
                            a.showComments = b.IsCommentsEnabled
                        }), b.getAllPosts().then(function(b) {
                            a.contentItemMetaData.loading = !1, a.blogPosts = [], angular.forEach(b, function(b) {
                                b.theDate = e(b.Created).format("MMMM Do YYYY"), b.pendingCommentsCount = 0, d.getAllComments(b.DiscussionId).then(function(a) {
                                    b.totalComments = a.length
                                }), a.blogPosts.push(b)
                            })
                        })
                    }()
            }
        }
    }]), angular.module("msContentItemBlogPostList").directive("msBlogPostSearch", ["Config", function(a) {
        return {
            restrict: "AE",
            replace: !0,
            scope: {
                searchText: "=",
                category: "="
            },
            templateUrl: a.GetSessionStoredValue("modulesDirectory") + "/msContentItemBlogPostList/msBlogPostSearch.tpl.html",
            link: function(b, c, d) {
                b.svgUrl = function(b) {
                    return a.GetEndPoint("modulesDirectory") + "/msContentItemBlog/sprites.svg#" + b
                }
            }
        }
    }]), angular.module("msDiscussionRepository", ["msRestangular"]), angular.module("msDiscussionRepository").factory("DiscussionRepository", ["DiscussionRestangular", "GuestbookRestangular", "$q", "$moment", function(a, b, c, d) {
        var e = function(a, b, d) {
                var e = c.defer();
                return a.all(b + "/comments").post(d).then(function(a) {
                    e.resolve(a)
                }, function(a) {
                    e.resolve(a)
                }), e.promise
            },
            f = function(b, c) {
                return e(a, b, c)
            },
            g = function(a, c) {
                return e(b, a, c)
            },
            h = function(a) {
                a && (a.ModeratedOn = d(a.ModeratedOn).format("MMMM Do YYYY"), a.Created = d(a.Created).format("MMMM Do YYYY"), a.LastModified = d(a.LastModified).format("MMMM Do YYYY"))
            },
            i = function(b, d, e) {
                var f = c.defer();
                return a.all(d + "/comments").customPUT(e).then(function(a) {
                    f.resolve(a)
                }, function(a) {
                    f.resolve(a)
                }), f.promise
            },
            j = function(b, c, d) {
                return i(a, c, d)
            },
            k = function(a, c, d) {
                return i(b, c, d)
            },
            l = function(a, b, d) {
                var e = c.defer();
                return a.one(b + "/comments").customDELETE(d).then(function(a) {
                    e.resolve(a)
                }, function(a) {
                    e.resolve(a)
                }), e.promise
            },
            m = function(b, c) {
                return l(a, b, c)
            },
            n = function(a, c) {
                return l(b, a, c)
            },
            o = function(a, b, d, e) {
                var f = c.defer();
                return a.all(b + "/comments/" + d + "/moderation").customPUT(e).then(function(a) {
                    f.resolve(a)
                }, function(a) {
                    f.resolve(a)
                }), f.promise
            },
            p = function(b, c, d) {
                return o(a, b, c, d)
            },
            q = function(a, c, d) {
                return o(b, a, c, d)
            },
            r = function(a, b) {
                var d = c.defer();
                return a.one(b, "comments").get().then(function(a) {
                    var b = [];
                    if (a && a.data && a.data.ResourceList) {
                        b = a.data.ResourceList;
                        for (var c = 0; b[c]; c++) h(b[c])
                    }
                    d.resolve(b)
                }), d.promise
            };
        return {
            addNewComment: f,
            addNewGuestbookComment: g,
            updateComment: j,
            updateGuestbookComment: k,
            deleteComment: m,
            deleteGuestbookComment: n,
            updateCommentModeration: p,
            updateGuestbookCommentModeration: q,
            getAllComments: function(b) {
                return r(a, b)
            },
            getAllGuestbookComments: function(a) {
                return r(b, a)
            }
        }
    }]), angular.module("msDiscussion", ["msDiscussionRepository"]), angular.module("msDiscussion").directive("msDiscussion", ["$compile", "DiscussionRepository", "Config", "$timeout", function(a, b, c, d) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                discussionId: "="
            },
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msDiscussion/msDiscussion.html",
            link: function(a, e) {
                a.svgUrl = function(a) {
                    return c.GetEndPoint("modulesDirectory") + "/msContentItemBlog/sprites.svg#" + a
                };
                var f, g = function(b) {
                    f && clearTimeout(f), a.message = b, f = d(function() {
                        a.message = ""
                    }, 5e3)
                };
                a.addComment = function() {
                    var c = {
                        Title: "New Comment",
                        Content: a.comment,
                        Author: "",
                        Images: []
                    };
                    b.addNewComment(a.discussionId, c).then(function(b) {
                        a.comment = "", g("Comment added."), h(a.discussionId)
                    })
                };
                var h = function(c) {
                    b.getAllComments(c).then(function(b) {
                        a.comments = b
                    })
                };
                a.paging = {}, a.$watch("discussionId", function(a) {
                    a && h(a)
                })
            }
        }
    }]), angular.module("msContentItemBlog", ["msContentItemBlogPost", "msContentItemBlogPostList", "msDiscussion"]), angular.module("msContentItemBlog").directive("msContentItemBlog", ["$compile", "Config", function(a, b) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "=",
                contentItemMetaData: "="
            },
            template: "<div></div>",
            link: function(b, c) {
                var d = function(a) {
                    var c = a.param1,
                        d = "ms-content-item-blog-post-list";
                    switch (c) {
                        case "post":
                            b.$emit("maincontentItem", {
                                context: "blog",
                                type: "post",
                                id: a.param2
                            }), d = "ms-content-item-blog-post";
                            break;
                        default:
                            d = "ms-content-item-blog-post-list"
                    }
                    return '<div><div ng-hide="!contentItemMetaData.loading" style="position: absolute;margin-left: 50%;margin-top: 10%;">Loading...</div><div ' + d + ' content-item-data="contentItemData" content-item-meta-data="contentItemMetaData"></div></div>'
                };
                ! function() {
                    a(d((b.contentItemMetaData || {}).urlParams))(b, function(a) {
                        c.html(a)
                    })
                }()
            }
        }
    }]), angular.module("msContentItemDivider", []), angular.module("msContentItemDivider").directive("msContentItemDivider", [function() {
        return {
            restrict: "A",
            replace: !0,
            template: "<hr>",
            link: function(a) {}
        }
    }]), angular.module("msContentItemDownloadableFile", []), angular.module("msContentItemDownloadableFile").directive("msContentItemDownloadableFile", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = "";
                b.contentItemData.settings.displayName && (d = '<div><a ng-href="{{contentItemData.settings.url}}" target="_blank" class="button">' + b.contentItemData.settings.displayName + "</a></div>"), a(d)(b, function(a) {
                    c.html(a)
                })
            }
        }
    }]), angular.module("msContentItemDownloadableFile").directive("msContentItemDownloadableFileEdit", ["$compile", function(a) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                contentItemData: "="
            },
            link: function(b, c) {
                var d = function() {
                    var d = '<div class="ms-no-settings">Click settings to add file.</div>';
                    b.contentItemData.settings.displayName && (d = '<div><a ng-href="{{contentItemData.settings.url}}" target="_blank" class="button">' + b.contentItemData.settings.displayName + "</a></div>"), a(d)(b, function(a) {
                        c.html(a)
                    })
                };
                d(), b.$watch("contentItemData.settings", function(a, b) {
                    d()
                }, !0)
            }
        }
    }]), angular.module("msContentItemDownloadableFile").directive("msContentItemDownloadableFileSettings", ["$compile", "$rootScope", "MediaLibraryManager", function(a, b, c) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                settings: "="
            },
            template: '<div><div class="row-fix"><div class="col-fix14"><label>{{settings.url}}</label></div></div><div class="row-fix"><div class="col-fix14"><div class="image-wrap"><ms-media-library mode="\'dialog\'" editable-id="editableId" uploaded-files="files" button-text="Add a file" title=modalTitle multiple-upload=false file-type="documents"></ms-media-library></div></div></div><div class="row-fix"><div class="col-fix14"><label>Display name</label></div></div><div class="row-fix"><div class="col-fix14"><input type="text" ng-model="settings.displayName"</div></div></div>',
            link: function(a) {
                a.settings.url = a.settings.url || "", a.files = [], a.files.push({
                    url: a.settings.url,
                    default: 0
                }), a.editableId = c.randomString(), a.modalTitle = "Upload file", a.$watch("files", function(b, c) {
                    a.settings.url = a.files[0].url
                }), a.$watch("settings", function(a, c) {
                    a !== c && b.$broadcast("markChanges", "downloadable file settings has been changed.")
                }, !0)
            }
        }
    }]), angular.module("msContentItemGuestbook", []), angular.module("msContentItemGuestbook").directive("msContentItemGuestbook", ["SiteRepository", "DiscussionRepository", "Config", "$compile", "$timeout", function(a, b, c, d, e) {
        return {
            restrict: "A",
            replace: !0,
            templateUrl: c.GetSessionStoredValue("modulesDirectory") + "/msContentItemGuestbook/guestbook.tpl.html",
            link: function(c, d, f) {
                c.comments = [];
                var g;
                a.getSiteExtensions().then(function(a) {
                    g = a.guestbookId || a.guestbookid, b.getAllGuestbookComments(g).then(function(a) {
                        c.comments = a
                    })
                }), c.formData = {}, c.formSubmitted = !1, c.submitForm = function(a) {
                    if (!1 === a.$valid) return c.formSubmitted = !0, !1;
                    var f = d.find(".submit-button");
                    return f.addClass("sending"), b.addNewGuestbookComment(g, {
                        title: c.formData.name,
                        author: c.formData.name,
                        content: c.formData.comment
                    }).then(function(a) {
                        201 === a.status ? (f.removeClass("sending"), f.addClass("sent"), f.find("span").text("Your comment has been sent"), e(function() {
                            f.removeClass("sent"), f.find("span").text("Send"), c.formData.name = "", c.formData.comment = ""
                        }, 2e3)) : (f.addClass("error"), f.find("span").text("There was an error sending your comment"), e(function() {
                            f.find("span").text("Send"), f.removeClass("error")
                        }, 2e3))
                    }), !0
                }
            }
        }
    }]), angular.module("msContentItems", ["msResourceUrlManager", "msContentItemsControls", "msContentItemSocialShare", "msContentItemSocialLink", "msContentItemContactForm", "msContentItemTwitter", "msContentItemText", "msContentItemNavigation", "msContentItemMap", "msContentItemHtml", "msContentItemSingleImage", "msContentItemSlideShow", "msSettingsPopup", "msContentItemSpacer", "msContentItemVideo", "msContentItemShop", "msContentItemShopBasket", "msContentItemShopMiniCart", "msContentItemShopProduct", "msContentItemShopProductList", "msContentItemBlog", "msContentItemDivider", "msContentItemDownloadableFile", "msContentItemGuestbook"]), angular.module("msContentItems").directive("msContentItem", ["PageBuilderManager", "ResourceUrlManager", "$compile", "$timeout", "$injector", "msContentItemsHelper", "LayoutServiceFactoryHelper", function(a, b, c, d, e, f, g) {
        return {
            restrict: "AEC",
            replace: !0,
            scope: {
                contentItemData: "=",
                editable: "="
            },
            link: function(d, h, i) {
                var j = "ms-content-item-" + d.contentItemData.type,
                    k = "msContentItem" + f.convertToCamelCase(d.contentItemData.type) + "EditDirective",
                    l = "msContentItem" + f.convertToCamelCase(d.contentItemData.type) + "SettingsDirective",
                    m = $("body").find(".settingsOverlay"),
                    n = function() {
                        return $("body").find(".settingsPlaceHolder")
                    },
                    o = $("body").find(".ms-topbar"),
                    p = $("body").find(".ms-sidebar");
                m.on("click", function() {
                    d.ok()
                }), d.level = i.level || "1", d.contentItemData.settings = d.contentItemData.settings || {
                    bla: "asd"
                }, d.contentItemMetaData = d.contentItemMetaData || {}, d.contentItemMetaData.urlParams = b.getAllParameters(), d.contentItemMetaData.setUrlParams = function(a, c, d, e, f) {
                    b.setUrlParameters({
                        pageId: a,
                        param1: c,
                        param2: d,
                        param3: e,
                        param4: f
                    })
                }, d.contentItemMetaData.setUrlParamsByPageType = function(c, d, e, f, g) {
                    a.getPages().then(function(a) {
                        if (a)
                            for (var h = 0; a[h]; h++)
                                if (a[h].type === c) {
                                    var i = a[h].url;
                                    return "/" === i[0] && (i = i.substr(1)), void b.setUrlParameters({
                                        pageId: i,
                                        param1: d,
                                        param2: e,
                                        param3: f,
                                        param4: g
                                    })
                                }
                    })
                };
                var q = function(a) {
                        var b = j;
                        a && e.has(k) && (b += "-edit");
                        var f = '<div ms-content-item-controls actions="actions" class="ms-block {{contentItemData.type}}-block ms-level-{{level}}" data-id="{{contentItemData.id}}"><div ' + b + ' content-item-data="contentItemData" content-item-meta-data="contentItemMetaData"></div></div>',
                            g = angular.element(f);
                        c(g)(d, function(a) {
                            h.html(a)
                        })
                    },
                    r = j.indexOf("-shop-category") > 0,
                    s = j.indexOf("-shop-category") > 0;
                d.actions = d.actions || {}, d.actions.controls = [], s || d.actions.controls.push("delete icon-delete"), e.has(l) && d.actions.controls.push("settings icon-settings"), r || d.actions.controls.push("handle icon-drag");
                var t = function() {
                    var a, b = n(),
                        c = $(window),
                        d = h.find(".element-control.settings"),
                        e = d.offset(),
                        f = {
                            top: c.scrollTop(),
                            left: c.scrollLeft()
                        },
                        g = e.top - 20,
                        i = d.offset().left - b.outerWidth() - 10;
                    f.right = f.left + c.width(), f.bottom = f.top + c.height(), b.css({
                        top: g,
                        left: i
                    });
                    var j = b.position().top + b.outerHeight();
                    j > f.bottom && (a = j - f.bottom + 20, b.css({
                        top: g - a
                    })), g < f.top + o.outerHeight() && (a = f.top + o.outerHeight() - g + 20, b.css({
                        top: g + a
                    })), i < f.left + p.outerWidth() && (a = f.left + p.outerWidth() - i + 20, b.css({
                        left: i + a
                    }))
                };
                d.actions.displaySettings = function() {
                    var a = n();
                    d.backupSettings = angular.copy(d.contentItemData.settings);
                    var b = '<div class="settings-buttons"><div class="ms-buttons"><button ng-click="ok()" class="ms-button primary">Ok</button><button ng-click="cancel()" class="ms-button danger">Cancel</button></div></div>',
                        e = g.getWidgetByType(d.contentItemData.type),
                        f = j + "-settings",
                        i = '<div><div class="settings-title">' + e + '<i class="icon-reorder"></i></div><div class="settings-wrapper" ms-scrollbar-plus><div class="settings-mask"><div ' + f + ' settings="contentItemData.settings"></div></div></div>' + b + "</div>",
                        k = angular.element(i);
                    $("body").find(".ms-block").removeClass("active"), c(k)(d, function(b) {
                        a.html(b);
                        var c = a.find(".settings-title");
                        a.draggable({
                            handle: c
                        });
                        var e = a.find(".settings-title"),
                            f = a.find(".settings-buttons");
                        a.find(".settings-wrapper").attr("style", "max-height: " + ($(window).outerHeight() - o.outerHeight() - 40 - f.outerHeight() - e.outerHeight()) + "px !important;");
                        var g = setInterval(function() {
                            a.outerHeight() > 100 && (clearInterval(g), t(), a.addClass("active " + d.contentItemData.type), m.addClass("active"), h.find(".ms-block").addClass("active"))
                        }, 50)
                    })
                };
                var u = function() {
                    var a = n();
                    a.removeClass("active " + d.contentItemData.type), m.removeClass("active").removeAttr("style"), h.find(".ms-block").removeClass("active"), a.removeAttr("style"), $("body").removeClass("ov-hidden")
                };
                d.ok = function() {
                    n().removeClass("active " + d.contentItemData.type), u()
                }, d.cancel = function() {
                    d.contentItemData.settings = d.backupSettings, u()
                }, q(d.editable)
            }
        }
    }]), angular.module("msContentItems").factory("msContentItemsHelper", [function() {
        var a = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        };
        return {
            convertToCamelCase: function(b) {
                for (var c = b.split("-"), d = "", e = 0; e < c.length; e++) d += a(c[e]);
                return d
            }
        }
    }]), angular.module("msThemeRepository", ["msRestangular", "msConfig"]), angular.module("msThemeRepository").factory("ThemeRepository", ["ThemeRestangular", "PageBuilderManager", "$q", function(a, b, c) {
        var d, e = function(b) {
                var d = c.defer();
                return a.one("", b).get().then(function(a) {
                    var b = a.data;
                    d.resolve(b)
                }), d.promise
            },
            f = function() {
                var a = c.defer();
                return b.getWebsiteData().then(function(b) {
                    for (var c = b.defaultTheme, d = 0; b.themes[d];) {
                        if (b.themes[d].id === c) return void a.resolve(b.themes[d]);
                        d++
                    }
                    a.resolve()
                }), a.promise
            };
        return {
            getTheme: e,
            getThemes: function() {
                if (!d) {
                    var b = c.defer();
                    a.one("").get().then(function(a) {
                        var c = a.data;
                        b.resolve(c)
                    }), d = b.promise
                }
                return d
            },
            getThemeSettings: function(a) {
                var b = c.defer();
                return b.resolve({
                    bgColor: "#555",
                    fontColor: "red",
                    fontSize: 15,
                    defaultFontFamily: "Arial",
                    logoImage: "http://uk.mrsite.com/assets/img/site-logo.png"
                }), b.promise
            },
            getCurrentTheme: f
        }
    }]), angular.module("msHelper", []), angular.module("msHelper").factory("Helper", [function() {
        return {
            guid: function() {
                function a() {
                    return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
                }
                return function() {
                    return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
                }
            }()
        }
    }]), angular.module("msMenuRepository", ["msRestangular", "msConfig"]), angular.module("msMenuRepository").factory("MenuRepository", ["SiteRestangular", "PageBuilderManager", "SiteRepository", "$q", function(a, b, c, d) {
        return {
            getMenu: function() {
                var a = d.defer();
                return b.getWebsiteData().then(function(b) {
                    var c = angular.copy(b.menu);
                    a.resolve(c)
                }, function(b) {
                    a.reject(b)
                }), a.promise
            },
            saveMenu: function(c) {
                var e = d.defer();
                return void 0 !== c && c ? a.all("menu").customPUT(c).then(function(a) {
                    e.resolve(!0)
                }, function(a) {
                    e.resolve(a)
                }) : b.getWebsiteData().then(function(b) {
                    a.all("menu").customPUT(b.menu).then(function(a) {
                        e.resolve(!0)
                    }, function(a) {
                        e.resolve(a)
                    })
                }), e.promise
            }
        }
    }]), angular.module("msMenu", ["msHelper", "msMenuRepository"]), angular.module("msMenu").factory("MenuManager", ["$q", "Helper", "$rootScope", "MenuRepository", "PageBuilderManager", function(a, b, c, d, e) {
        var f = function(a, b) {
                return angular.forEach(a, function(c, d) {
                    c.pageId === b.id && a.splice(d, 1), c.subMenuItems && f(c.subMenuItems, b)
                }), a
            },
            g = function(b, c) {
                c = c || [];
                var d = a.defer();
                return e.getWebsiteData().then(function(a) {
                    var e = i(b);
                    if (c && c.length)
                        for (var f = 0; f < c.length; f++) {
                            var g = c[f],
                                h = i(g);
                            e.subMenuItems.push(h)
                        }
                    a.menu.push(e), d.resolve(!0)
                }), d.promise
            },
            h = function(a) {
                return a || b.guid()
            },
            i = function(a) {
                var b = null;
                return "Category" === a.type || "category" === a.type ? b = {
                    type: "Category",
                    categories: a.categories,
                    id: h(a.id),
                    subMenuItems: [],
                    url: a.url,
                    name: a.name
                } : (b = {
                    type: "Page",
                    pageId: a.pageId,
                    id: h(a.id),
                    subMenuItems: [],
                    url: a.url,
                    name: a.name
                }, b.pageId = b.pageId || b.id), b
            };
        return {
            addToMenu: g,
            createMenuItem: i,
            removeFromMenu: function(b) {
                var c = a.defer();
                return e.getWebsiteData().then(function(a) {
                    a.menu = f(a.menu, b), c.resolve(!0)
                }), c.promise
            },
            replaceMenuWithNewRepresentation: function(b) {
                var c = a.defer();
                return e.getWebsiteData().then(function(a) {
                    a.menu = b, c.resolve(!0)
                }), c.promise
            }
        }
    }]), angular.module("msPageBuilderManager", ["msSiteRepository", "msThemeRepository", "msMenu"]), angular.module("msPageBuilderManager").factory("PageBuilderManager", ["SiteRepository", "$q", function(a, b) {
        var c, d, e, f, g = !1,
            h = function() {
                var a = b.defer();
                return a.resolve(g), a.promise
            },
            i = function(a) {
                var c = b.defer();
                return g = a, c.resolve(g), c.promise
            },
            j = function(d) {
                var e = b.defer();
                if (!c)
                    if (d) {
                        var f = b.defer();
                        c = f.promise, f.resolve(d)
                    } else c = a.getSite();
                return c.then(function(a) {
                    e.resolve(a)
                }), e.promise
            },
            k = function() {
                var d = b.defer();
                return c || (c = a.getSite()), c.then(function(a) {
                    d.resolve(a.settings)
                }), d.promise
            },
            l = function() {
                var d = b.defer();
                return c || (c = a.getSite()), c.then(function(a) {
                    d.resolve(a.logoImage)
                }), d.promise
            },
            m = function() {
                var d = b.defer();
                return c || (c = a.getSite()), c.then(function(a) {
                    d.resolve(a.images)
                }), d.promise
            },
            n = function(c) {
                var d = b.defer();
                return j().then(function() {
                    a.updateSite({
                        images: c
                    }).then(function() {
                        d.resolve("Saved")
                    })
                }), d.promise
            },
            o = function() {
                var a = b.defer();
                return j().then(function() {
                    a.resolve(d)
                }), a.promise
            },
            p = function() {
                var a = b.defer();
                return j().then(function(b) {
                    a.resolve(b.pages)
                }), a.promise
            },
            q = function() {
                var a = b.defer();
                return j().then(function(b) {
                    a.resolve(d.pagecontentblocks)
                }), a.promise
            },
            r = function(a) {
                var c = b.defer();
                return j().then(function(b) {
                    d = b.pages.filter(function(b) {
                        return String(b.url).substring(1).toLowerCase() === a
                    })[0], c.resolve(d)
                }), c.promise
            },
            s = function(c, d) {
                var e = b.defer(),
                    f = a.createNewPage(c, d);
                return e.resolve(f), e.promise
            },
            t = function(a) {
                var c = b.defer();
                return j().then(function(b) {
                    b.pages.push(a), v().then(function() {
                        c.resolve(a)
                    })
                }), c.promise
            },
            u = function(a) {
                var c = b.defer();
                return j().then(function(b) {
                    var d = -1;
                    angular.forEach(b.pages, function(b, c) {
                        a.id === b.id && (d = c)
                    }), d >= 0 && (b.pages.splice(d, 1), a.ishomepage && b.pages[0] && (b.pages[0].ishomepage = !0));
                    var e = -1,
                        f = -1;
                    angular.forEach(b.menu, function(b, c) {
                        a.id === b.pageId ? e = c : b.subMenuItems && angular.forEach(b.subMenuItems, function(b, d) {
                            a.id === b.pageId && (e = c, f = d)
                        })
                    }), e >= 0 && -1 === f ? b.menu.splice(e, 1) : e >= 0 && b.menu[e].subMenuItems.splice(f, 1), v().then(function() {
                        w(), c.resolve()
                    })
                }), c.promise
            },
            v = function() {
                var c = b.defer();
                return j().then(function(b) {
                    a.updateSite({
                        pages: b.pages
                    }).then(function() {
                        c.resolve("Saved")
                    })
                }), c.promise
            },
            w = function() {
                var a = b.defer();
                return j().then(function(a) {}), a.promise
            },
            x = function(c) {
                var d = b.defer();
                return j().then(function() {
                    a.updateSite({
                        logoImage: c
                    }).then(function() {
                        d.resolve("Saved")
                    })
                }), d.promise
            },
            y = function() {
                var d = b.defer();
                return c || (c = a.getSite()), c.then(function(a) {
                    for (var b = a.defaultTheme, c = 0; a.themes[c];) {
                        if (a.themes[c].id === b) return void d.resolve(a.themes[c]);
                        c++
                    }
                    d.resolve()
                }), d.promise
            },
            z = function(c, d, e) {
                var f = b.defer();
                return a.saveContentSnapShot({
                    domainname: c,
                    path: d,
                    pagesource: e
                }).then(function() {
                    f.resolve("Saved")
                }), f.promise
            },
            A = function() {
                var d = b.defer();
                return c || (c = a.getSite()), c.then(function(a) {
                    return d.resolve(a.siteId), c
                }), d.promise
            },
            B = function() {
                return e || (e = a.getThemeUpdates()), e
            },
            C = function(b) {
                return e = void 0, a.updateTheme(b)
            };
        return {
            createNewPage: s,
            getSiteId: A,
            getWebsiteData: j,
            getLogoImage: l,
            getCurrentPage: o,
            getCurrentPageContentBlocks: q,
            setCurrentPage: r,
            addPage: t,
            deletePage: u,
            saveMenu: w,
            saveWebsiteData: v,
            saveLogo: x,
            getPages: p,
            getEditable: h,
            setEditable: i,
            getCurrentTheme: y,
            getImages: m,
            saveImages: n,
            getSiteSettings: k,
            saveContentSnapShot: z,
            getThemeUpdates: B,
            updateTheme: C,
            getMyThemes: function() {
                return f || (f = a.getMyThemes()), f
            },
            installTheme: function(b) {
                return f = void 0, c = void 0, a.installTheme(b)
            },
            setThemeToLive: function(b) {
                return f = void 0, a.setThemeToLive(b)
            },
            deleteMyThemeById: function(b) {
                return f = void 0, a.deleteMyThemeById(b)
            }
        }
    }]), angular.module("msContentItemsLayout", ["msContentItems", "msPageBuilderManager"]), angular.module("msContentItemsLayout").filter("getRowStyles", function() {
        return function(a) {
            var b = "";
            return a.color && a.useColor && (b += "background-color:" + a.color + ";"), b
        }
    }), angular.module("msContentItemsLayout").directive("msContentItemsLayoutDirective", ["$compile", "PageBuilderManager", function(a, b) {
        return {
            restrict: "C",
            replace: !0,
            link: function(c, d, e) {
                b.getCurrentPage().then(function(e) {
                    b.getEditable().then(function(b) {
                        c.pagedata = e.pagecontentblocks, c.editable = b, c.getStyles = function(a) {};
                        var f = angular.element('<div class="no-element">Drag &amp; Drop elements here</div>'),
                            g = '<div ng-if="next.type===\'row\'" data-id="{{next.id}}" class="ms-row ms-level-2"><div class="ms-row-inner"><div ng-repeat="col1 in next.content" data-id="{{col1.id}}" data-size="{{col1.size}}" class="ms-col ms-level-2" ng-class="\'ms-col-\' + col1.size"><div ng-repeat="next1 in col1.content" level="2" ms-content-item content-item-data="next1" editable="editable"></div></div></div></div>',
                            h = '<div ng-repeat="row in pagedata" data-id="{{row.id}}" ng-init="row.settings.color=row.settings.color||\'#ffffff\'" class="ms-row ms-level-1" style="{{row.settings | getRowStyles}}"><div class="ms-row-inner"><div ng-repeat="col in row.content" data-id="{{col.id}}" data-size="{{col.size}}" class="ms-col ms-level-1" ng-class="\'ms-col-\' + col.size"><div ng-repeat="next in col.content"><div ng-if="next.type!==\'row\'" level="1" ms-content-item content-item-data="next" editable="editable"></div>' + g + "</div></div></div></div>",
                            i = angular.element(h);
                        a(i)(c, function(a) {
                            d.append(a), b && c.$watchCollection("pagedata", function() {
                                setTimeout(function() {
                                    if (void 0 === c.pagedata || 0 === c.pagedata.length) {
                                        d.before(f);
                                        var a = $(".no-element").parent().css("padding");
                                        $(".no-element").parent().css({
                                            position: "relative",
                                            height: $(".no-element").outerHeight() + 2 * a
                                        }), d.css({
                                            top: "50%",
                                            position: "absolute",
                                            width: d.parent().width(),
                                            "box-sizing": "border-box"
                                        })
                                    } else $(".no-element").parent().removeAttr("style"), d.removeAttr("style"), $(".no-element").remove();
                                    d.find("input.colorRow").minicolors({
                                        change: function(a, b) {
                                            c.$apply()
                                        },
                                        position: "top left",
                                        opacity: !1,
                                        control: "brightness"
                                    })
                                })
                            })
                        })
                    })
                })
            }
        }
    }]), angular.module("msImageItem", ["msPageBuilderManager", "msMediaLibrary"]), angular.module("msImageItem").directive("msImageItem", ["$compile", "$sce", "$rootScope", "MediaLibraryManager", "PageBuilderManager", "$timeout", function(a, b, c, d, e, f) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                isEditable: "=",
                msImageItem: "=",
                multiple: "="
            },
            link: function(b, c) {
                b.editableId = d.randomString(), b.images = b.$parent.images || {}, b.uploadImages = [], b.removeImage = function() {
                    b.images[b.msImageItem].value = "", b.images[b.msImageItem].themeImage = "", b.images[b.msImageItem].isRemove = !0, b.uploadImages = [], c.find("img").attr("ng-src", ""), c.find("img").attr("src", ""), b.$parent.images = b.images, b.$parent.$root.$broadcast("markChanges", b.msImageItem + " has been removed.")
                };
                var e = function() {
                    (void 0 === b.images[b.msImageItem] || "" === b.images[b.msImageItem].value && !1 === b.images[b.msImageItem].isRemove) && (b.images[b.msImageItem] = {
                        value: "",
                        themeImage: c.find("img").attr("src"),
                        isRemove: !1
                    }), b.displayImage = b.images[b.msImageItem].value, "" !== b.displayImage || b.images[b.msImageItem].remove || (b.displayImage = b.images[b.msImageItem].themeImage), c.find("img").attr("ng-src", b.displayImage), c.find("img").attr("src", b.displayImage);
                    var d = c.html();
                    b.isEditable && void 0 !== b.isEditable && (c.addClass("ms-tools"), d += '<a class="delete icon-delete ms-button danger" style="position: absolute;top: 3px;z-index: 1;left: -8px;font-size: 0.7rem;" ng-click="removeImage()" ng-if="displayImage"></a>', c.find("ms-media-library").attr("mode") || (b.uploadImages.push({
                        url: "",
                        default: 0
                    }), d += '<ms-media-library button-text="Add a logo" mode="\'hover\'" editable-id="editableId" uploaded-files="uploadImages" multiple-upload=multiple title="name"></ms-media-library>')), c.attr("style", "padding-top:0.3em;"), a(d)(b, function(a) {
                        c.html(a)
                    })
                };
                b.$watch("uploadImages", function() {
                    b.images[b.msImageItem] && b.uploadImages.length > 0 && b.images[b.msImageItem].value !== b.uploadImages[0].url && (b.images[b.msImageItem].value = b.uploadImages[0].url, b.images[b.msImageItem].isRemove = !1, b.$parent.images = b.images, b.$parent.$root.$broadcast("markChanges", b.msImageItem + " has been changed.")), e()
                })
            }
        }
    }]), angular.module("msHeaderItemText", []), angular.module("msHeaderItemText").directive("msHeaderItemText", ["$compile", "$sce", "$filter", "$timeout", function(a, b, c, d) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                msHeaderItemText: "=",
                editable: "=",
                page: "=",
                fitText: "="
            },
            link: function(b, e, f) {
                e.addClass("ms-header-text-item");
                var g = b.page || b.$parent.page || {};
                g.pageTexts = g.pageTexts || {}, g.pageTexts[b.msHeaderItemText] = g.pageTexts[b.msHeaderItemText] || {
                    value: e.html()
                }, b.text = g.pageTexts[b.msHeaderItemText];
                var h = "";
                b.editable && (h = 'data-placeholder="Click here to edit text"');
                var i = "<span " + h + ">" + c("htmlToPlainText")(b.text.value) + "</span>";
                d(function() {
                    var a = e.css("font-size");
                    e.attr("data-original-size", a)
                }, 10);
                var j = function(a, b) {
                        d(function() {
                            var c = 11,
                                d = function() {
                                    a.attr("style", "")
                                },
                                e = function() {
                                    var c = a[0].scrollWidth;
                                    return {
                                        parentEl: a.parents(b).width(),
                                        el: c
                                    }
                                },
                                f = function() {
                                    var a = e();
                                    return a.el > a.parentEl
                                },
                                g = function(b) {
                                    b > c ? a.css("font-size", b) : a.css("font-size", c)
                                };
                            ! function() {
                                d();
                                var b = parseInt(a.css("font-size")),
                                    c = e();
                                f() && g(Math.floor(b *= c.parentEl / c.el))
                            }()
                        }, 100)
                    },
                    k = _.debounce(function() {
                        j(e, b.fitText)
                    }, 200);
                d(function() {
                    b.fitText && (j(e, b.fitText), $(window).on("resize", function() {
                        k()
                    }))
                }, 200), b.$watch("text.value", function(a) {
                    0 === a.length ? e.addClass("empty") : e.removeClass("empty")
                }), a(i)(b, function(a) {
                    e.html(a)
                }), b.editable && (e.attr("contentEditable", !0), e.attr("data-placeholder", "Click here to edit text")), $(e).on("keyup paste", function() {
                    b.$apply(function() {
                        b.text.value = e.text()
                    }), b.fitText && j(e, b.fitText);
                    var a = e.find("br");
                    a.length && a.remove()
                }), $(e).on("blur", function() {
                    b.$apply(function() {
                        b.text.value = e.text()
                    }), b.fitText && j(e, b.fitText);
                    var a = c("htmlToPlainText")(b.text.value);
                    a.trim && "function" == typeof a.trim && (a = a.trim());
                    var d = "";
                    b.editable && (d = 'data-placeholder="Click here to edit text"'), e.html('<span class="ng-scope" ' + d + ">" + a + "</span>")
                })
            }
        }
    }]), angular.module("msHeaderItemLogo", ["msPageBuilderManager", "msMediaLibrary"]), angular.module("msHeaderItemLogo").directive("msHeaderItemLogo", ["$compile", "$sce", "$rootScope", "MediaLibraryManager", "PageBuilderManager", function(a, b, c, d, e) {
        return {
            restrict: "A",
            replace: !0,
            scope: {
                isEditable: "="
            },
            link: function(b, c) {
                b.logoImage = b.logoImage || "", e.getLogoImage().then(function(a) {
                    b.logoImage = a;
                    var c = b.logoImage || "https://s3-eu-west-1.amazonaws.com/irhtestbucket/uploads/ender.jpg";
                    b.images = [], b.images.push({
                        url: c,
                        default: 0
                    })
                }), b.editableId = d.randomString();
                var f = function() {
                    var d = "";
                    b.isEditable ? (b.modalTitle = "Header logo", b.multiple = !0, d = '<span class="hidden">Ender</span><img src=' + b.images[0].url + '><ms-media-library mode="\'hover\'" editable-id="editableId" uploaded-files="images" multiple-upload=multiple title="modalTitle"></ms-media-library>') : d = '<span class="hidden">Ender</span><img src=' + b.images[0].url + ">", a(d)(b, function(a) {
                        c.html(a)
                    })
                };
                b.$watch("images", function() {
                    try {
                        b.images[0].url = b.image[0].url.replace(/'/g, "''")
                    } catch (a) {}
                    b.images[0].url !== b.logoImage && e.saveLogo(b.images[0].url).then(function() {}), f()
                })
            }
        }
    }]), angular.module("msTemplateRepository", ["msSiteRepository", "msConfig"]), angular.module("msTemplateRepository").factory("TemplateRepository", ["Config", "$window", "$http", "$q", "PageBuilderManager", "SiteRestangular", function(a, b, c, d, e, f) {
        var g, h = Math.floor((new Date).getTime() / 1e3 / 60),
            i = {
                html: "<div>We could not load the requested page</div>",
                styles: "",
                importLess: ""
            },
            j = function(a) {
                return c.get(a + "?v=" + h, {
                    cache: !0
                })
            },
            k = function(a, b, c, d) {
                j(a).success(function(a) {
                    c.success(function(b) {
                        d.resolve({
                            html: a,
                            styles: b
                        })
                    }).error(function() {
                        d.resolve({
                            html: a,
                            styles: i.styles
                        })
                    })
                }).error(function() {
                    if (!b || "" === b) return void d.resolve({
                        html: i.html,
                        styles: i.styles
                    });
                    k(b, "", c, d)
                })
            },
            l = function(b) {
                var c = d.defer();
                return e.getSiteId().then(function(d) {
                    var e = a.GetEndPoint("themesEndpoint") + d + "/" + b + "/";
                    c.resolve(e)
                }), c.promise
            },
            m = function(a, b, c) {
                var e = d.defer();
                return l(a).then(function(a) {
                    var b = a + "page.html",
                        d = "";
                    c && (b = a + "home.html", d = a + "page.html");
                    var f = a + "main.css",
                        g = j(f);
                    k(b, d, g, e)
                }), e.promise
            },
            n = function(a, b) {
                var c = d.defer();
                return l(a).then(function(a) {
                    var d = a + "main." + b,
                        e = a + "imports." + b,
                        f = j(e);
                    j(d).success(function(a) {
                        f.success(function(b) {
                            c.resolve({
                                mainStyles: a,
                                importStyles: b
                            })
                        }).error(function() {
                            c.resolve({
                                mainStyles: a,
                                importStyles: i.importLess
                            })
                        })
                    }).error(function() {
                        f.success(function(a) {
                            c.resolve({
                                mainStyles: i.styles,
                                importStyles: a
                            })
                        }).error(function() {
                            c.resolve({
                                mainStyles: i.styles,
                                importStyles: i.importLess
                            })
                        })
                    })
                }), c.promise
            },
            o = function(a) {
                return n(a, "less")
            },
            p = function(a) {
                return n(a, "scss")
            };
        return {
            getTemplate: m,
            getTemplateLess: o,
            getTemplateSass: p,
            getTemplateSettings: function(a) {
                var b = d.defer();
                return a ? (g || (g = f.one("themes/" + a + "/settings").get()), g.then(function(a) {
                    a.data.Settings instanceof Array || (a.data.Settings = JSON.parse(a.data.Settings));
                    var c = a.data.Settings;
                    angular.forEach(c, function(a) {
                        a.variable = a.variable || a.Variable, a.name = a.name || a.Name, void 0 === a.value && (a.value = a.Value), a.type = a.type || a.Type || "color"
                    }), b.resolve({
                        settings: c,
                        styles: a.data.Styles,
                        compiler: a.data.Compiler
                    })
                }), b.promise) : b.promise
            },
            setTemplateSettings: function(a, b) {
                var c = d.defer();
                return a ? (f.all("themes/" + a + "/settings").customPUT(b).then(function(a) {
                    angular.forEach(b, function(a) {
                        a.Variable = a.variable, a.Name = a.name, a.Value = a.value, a.Type = a.type
                    }), c.resolve(a)
                }), c.promise) : c.promise
            }
        }
    }]), angular.module("msLess", []), angular.module("msLess").factory("LessManager", ["$q", function(a) {
        return {
            editablesToSettings: function(b) {
                for (var c = a.defer(), d = "", e = 0; e < b.length; e++) {
                    var f = b[e];
                    if ("mixin" === f.SettingType) {
                        var g = "." + f.Variable + "{",
                            h = "";
                        if (f.Variables)
                            for (var i in f.Variables)
                                if (f.Variables.hasOwnProperty(i)) {
                                    var j = f.Variables[i];
                                    h += "@" + f.Variable + "-" + i + ":" + j.Value + ";", g += i + ":" + j.Value + ";"
                                } g += "}", d += h + g
                    } else "image" === f.type && "'" !== f.value[0] && '"' !== f.value[0] ? d += "@" + f.variable + ":'" + f.value + "';" : d += "@" + f.variable + ":" + f.value + ";"
                }
                return c.resolve(d), c.promise
            },
            compile2Css: function(b) {
                var c = a.defer();
                return less.render(b, function(a, b) {
                    a ? c.resolve({
                        err: a
                    }) : c.resolve(b)
                }), c.promise
            }
        }
    }]);
angular.module("msSass", []), angular.module("msSass").factory("SassManager", ["$q", function(a) {
    var b, c = function(b) {
            for (var c = a.defer(), d = "", e = 0; e < b.length; e++) {
                var f = b[e];
                d += "$" + f.variable + ":" + f.value + ";"
            }
            return c.resolve(d), c.promise
        },
        d = function(b) {
            var c = a.defer(),
                d = Sass.compile(b);
            return c.resolve(d), c.promise
        },
        e = function(a) {
            b = {
                scss: a
            }
        },
        f = function(a) {
            b[a] = b.scss
        },
        g = "[A-Z]|[a-z]|:|\\s|[0-9]|-|\\.|@media|\\(|\\)|\\[|\\]|\\*|\\&|#|>|\\,",
        h = "\\r\\n|\\n|\\r|\\t|\\s\\s|^\\s",
        i = "[A-Z]|[a-z]|:|\\s|[0-9]|-|%|\\.|_|\\(|\\)|\\!|\\,|\\||\\'|\\\"|\\+|\\/|#|@include",
        j = "\\/\\*([^*]|[\\r\\n]|(\\*+([^*\\/]|[\\r\\n])))*\\*+\\/",
        k = function(a) {
            var b = a,
                c = new RegExp("^(" + g + ")*([A-Z]|[a-z]|\\*)(" + g + ")*\\{(" + h + ")*\\}(" + h + ")", "gm");
            return b = b.replace(c, ""), b = b.replace(c, ""), b = b.replace(c, ""), b = b.replace(c, "")
        },
        l = function(a) {
            var b = a;
            for (b = b.replace(new RegExp("\\/\\/.*(" + h + ")*", "gm"), "\r\n"); b.indexOf("/*NOCOMPILE*/") >= 0;) {
                var c = b.indexOf("/*NOCOMPILE*/"),
                    d = b.indexOf("/*ENDNOCOMPILE*/");
                d >= 0 ? d += 16 : d = 13, b = b.substr(0, c) + b.substr(d)
            }
            return b = b.replace(new RegExp(j, "gm"), "")
        },
        m = function(a) {
            var b = a;
            return b = b.replace(new RegExp("(" + h + ")", "gm"), "")
        },
        n = function(a) {
            var b = a;
            return b = m(b), b = b.replace(new RegExp(";", "gm"), ";\r\n"), b = b.replace(new RegExp("\\{", "gm"), "{\r\n"), b = b.replace(new RegExp("\\}", "gm"), "}\r\n"), b = b.replace(new RegExp("#\\{\\r\\n.*\\}(\\r\\n.*;)?", "gm"), function(a) {
                return a.replace(new RegExp("(" + h + ")", "gm"), "")
            })
        },
        o = function(a) {
            var b = a;
            return b = b.replace(new RegExp("^(" + i + ")*;(" + h + ")", "gm"), "")
        },
        p = function(a) {
            var b;
            return b = a, b = l(b), b = n(b), b = o(b), b = k(b)
        };
    return {
        editablesToSettings: c,
        compile2Css: d,
        simplifyScss: function(a) {
            if (!b) return "";
            var c = "simplified",
                d = "simplifiedUncompressed";
            if (b[c] || (b[d] = p(b.scss), b[c] = m(b[d])), a = a || "scss", b[a]) return b[a];
            var e;
            return e = b[d], e = e.replace(new RegExp("^(" + i + "|\\$)*;(" + h + ")", "gm"), function(b) {
                return "$" === b[0] || "$" === b[1] || b.indexOf(a) >= 0 ? b : ""
            }), e = k(e), e = k(e), e = m(e), b[a] = e, b[a]
        },
        storeScss: e,
        compressScssFailed: f
    }
}]), angular.module("msChangesTrackingManager", []), angular.module("msChangesTrackingManager").directive("msChangesNotification", ["$compile", function(a) {
    return {
        restrict: "A",
        replace: !0,
        scope: !1,
        link: function(b, c, d) {
            a('<div class="notification" ng-show="changesMessage"><h2>{{changesMessage}}</h2></div>')(b, function(a) {
                c.html(a)
            })
        }
    }
}]), angular.module("msChangesTrackingManager").factory("msChangesTracking", ["$rootScope", "$timeout", "$window", function(a, b, c) {
    return a.changes = a.changes || [], a.$on("markChanges", function(b, c) {
        a.displayChangesTrackingMessage && (a.changesMessage = a.defaultChangesMessage), -1 === a.changes.indexOf(c) && a.changes.push(c)
    }), a.$on("unMarkChanges", function(b, c) {
        -1 !== a.changes.indexOf(c) && a.changes.splice(c)
    }), a.$on("saveChanges", function(c, d) {
        a.changes = [], a.changesMessage = d, b(function() {
            a.changesMessage = ""
        }, a.changesTimer)
    }), a.$watch("changes", function() {
        a.changes.length > 0 ? c.onbeforeunload = function() {
            return a.leavingPageMessage
        } : c.onbeforeunload = function() {}
    }, !0), {}
}]), angular.module("msScript", []), angular.module("msScript").directive("msScript", ["$compile", function(a) {
    return {
        replace: !0,
        template: "<div></div>",
        restrict: "E",
        link: function(a, b, c) {
            var d = c.src;
            b.html('<script src="' + d + '"><\/script>')
        }
    }
}]), angular.module("msCreatedBy", []), angular.module("msCreatedBy").directive("msCreatedBy", ["$compile", function(a) {
    return {
        restrict: "E",
        link: function(b, c) {
            b.settings = b.$parent.settings || {};
            var d = function() {
                var d = '<div class="created-by"><a href="http://www.mrsite.com/uk" target="_blank">Created at Mr Site</a></div>';
                !0 === b.settings.hideCreatedBy && (d = ""), a(d)(b, function(a) {
                    c.html(a)
                })
            };
            b.$watch("settings.hideCreatedBy", function() {
                d()
            })
        }
    }
}]), angular.module("msCopyright", ["msCreatedBy"]), angular.module("msCopyright").directive("msCopyright", ["$compile", function(a) {
    return {
        restrict: "E",
        link: function(b, c) {
            b.domains = b.$parent.$root.siteData.domains, b.settings = b.$parent.settings || {}, b.date = (new Date).getFullYear();
            var d = function() {
                var d = b.domains[0].name;
                b.domains.length > 1 && (d = b.domains[1].name), b.copyrightName = b.settings.siteName || d;
                var e = '<div class="copyright"> &copy; Copyright ' + b.copyrightName + " " + b.date + "<ms-created-by></ms-created-by> </div>";
                a(e)(b, function(a) {
                    c.html(a)
                })
            };
            b.$watch("settings.siteName", function() {
                d()
            })
        }
    }
}]), angular.module("msAddPage", []), angular.module("msAddPage").directive("msAddPage", ["$compile", "$rootScope", "$filter", "$timeout", "$location", "Config", "$auth", "PackageRepository", "PageBuilderManager", "MenuManager", "MenuRepository", "ngDialog", function(a, b, c, d, e, f, g, h, i, j, k, l) {
    return {
        restrict: "E",
        replace: !0,
        scope: {
            siteData: "="
        },
        templateUrl: f.GetSessionStoredValue("modulesDirectory") + "/msAddPage/addpage.tpl.html",
        link: function(a, d) {
            a.settings = a.$parent.siteData.settings || {}, a.pageToAdd = {}, a.addToMenu = {
                add: !1
            }, a.pages = a.siteData.pages || [], a.pageExists = !1, a.addPageModal = function() {
                a.pageToAdd = {}, a.pageExists = !1, a.pages = a.siteData.pages || [], l.open({
                    template: "presentation/pagebuilder/add-page.modal.tpl.html",
                    scope: a,
                    className: "add-page tabs"
                })
            }, a.updateUrl = function(b) {
                a.pageToAdd.url = "/" + c("cleanUrl")(b)
            };
            var f = function(b) {
                var c = !1;
                return angular.forEach(a.pages, function(a) {
                    a.name.toLowerCase() === b.toLowerCase() && (c = !0)
                }), c
            };
            a.addPage = function() {
                a.pageError = void 0, "shop" === a.pageToAdd.name.toLowerCase() || "blog" === a.pageToAdd.name.toLowerCase() ? (a.pageExists = !0, a.errorMessage = "A page named " + a.pageToAdd.name.toLowerCase() + " cannot be added.") : f(a.pageToAdd.name) ? (a.pageExists = !0, a.errorMessage = "A page with that name already exists, please use another name.") : (a.pageExists = !1, i.createNewPage(a.pageToAdd.name, "Page").then(function(c) {
                    a.siteData.pages.push(c), !0 === a.addToMenu.add ? (j.addToMenu(c), k.saveMenu().then(function() {
                        a.pageAmount.used += 1, b.$broadcast("markChanges", a.pageToAdd.name + " page has been added."), e.path("pageBuilder" + c.url)
                    })) : (a.pageAmount.used += 1, b.$broadcast("markChanges", a.pageToAdd.name + " page has been added."), e.path("pageBuilder" + c.url))
                }), a.pageToAdd = {}, b.$broadcast("modalClose"), l.close())
            }, a.buyNow = function() {
                a.settings.accountId && g.redirectToAccountCentre(a.settings.accountId, !0)
            };
            var h = function() {
                var b = d.find(".status-bar"),
                    c = function() {
                        var c = b.find(".ui-progressbar-value"),
                            d = a.pageAmount.used / a.pageAmount.limit * 100;
                        d < 60 ? c.css({
                            background: "#a9d96c"
                        }) : d < 70 ? c.css({
                            background: "#f8d347"
                        }) : d < 80 ? c.css({
                            background: "#ffa760"
                        }) : c.css({
                            background: "#ff6c60"
                        })
                    };
                if (a.settings && a.settings.pageLimit && a.pages && a.pages.length) {
                    for (var e = 0, f = 0; f < a.pages.length; f++) "shop" !== a.pages[f].type.toLowerCase() && "blog" !== a.pages[f].type.toLowerCase() && e++;
                    a.pageAmount = {
                        used: e,
                        limit: parseInt(a.settings.pageLimit)
                    }, a.isExceed = !1, a.pageAmount.used >= a.pageAmount.limit && (a.isExceed = !0), b.progressbar({
                        value: a.pageAmount.used,
                        max: a.pageAmount.limit
                    }), c()
                } else i.getWebsiteData().then(function(d) {
                    a.pages = d.pages;
                    for (var e = 0, f = 0; f < a.pages.length; f++) "shop" !== a.pages[f].type.toLowerCase() && "blog" !== a.pages[f].type.toLowerCase() && e++;
                    a.pageAmount = {
                        used: e,
                        limit: parseInt(d.settings.pageLimit)
                    }, a.isExceed = !1, a.pageAmount.used >= a.pageAmount.limit && (a.isExceed = !0), b.progressbar({
                        value: a.pageAmount.used,
                        max: a.pageAmount.limit
                    }), c()
                }), b.bind("progressbarchange", function(a, b) {
                    c()
                })
            };
            a.$watch("settings", function() {
                h()
            })
        }
    }
}]), angular.module("msTemplateLoader", ["msContentItemsLayout", "msContentItems", "msImageItem", "msHeaderItemText", "msHeaderItemLogo", "msTemplateRepository", "msConfig", "msLess", "msSass", "msChangesTrackingManager", "msScript", "msCopyright", "msAddPage"]), angular.module("msTemplateLoader").directive("msTemplateLoaderDirective", ["$document", "$compile", "$timeout", "TemplateLoaderDirectiveHelpers", "TemplateRepository", "LessManager", "SassManager", "msChangesTracking", "PageBuilderManager", "$rootScope", "MetaDataManager", function(a, b, c, d, e, f, g, h, i, j, k) {
    return {
        restrict: "AEC",
        replace: !1,
        scope: {
            page: "=",
            themeId: "=",
            editMode: "=",
            images: "=",
            settings: "=",
            working: "="
        },
        link: function(a, h, l) {
            var m = a.$new(!0);
            m.settings = a.settings, a.editMode || angular.element("body").css("display", "none");
            var n = "page";
            a.$on("maincontentItem", function(b, c, d) {
                n = c.type, a.editMode || k.injectMetaDataInPage(c.context, c.type, c.id, a.page.name, (a.page.seo || {}).metaDescription, a.settings.siteName, a.settings.favicon)
            }), a.$watch("images", function() {
                m.images = a.images
            }, !0), a.$watch("settings", function() {
                m.settings = a.settings, m.page = a.page, a.page && c(function() {
                    "page" === n && k.injectMetaDataInPage("site", "page", a.page.id, a.page.name, (a.page.seo || {}).metaDescription, a.settings.siteName, a.settings.favicon)
                }, 300)
            }, !0), a.$watch("editMode", function() {
                m.editMode = a.editMode
            }), a.$watch("page", function() {
                m.page = a.page, a.page && c(function() {
                    "page" === n && k.injectMetaDataInPage("site", "page", a.page.id, a.page.name, (a.page.seo || {}).metaDescription, a.settings.siteName, a.settings.favicon)
                }, 300)
            });
            var o = function(a) {
                return i.getWebsiteData().then(function(b) {
                    return d.getHelpersForTheTemplate(b, a).then(function(a) {
                        m.helper = a
                    })
                })
            };
            if (a.editMode) {
                var p = angular.element("#cssStylesPrev");
                0 === p.length && (angular.element("head").append(angular.element('<style id="cssStylesPrev"></style>')), p = angular.element("#cssStylesPrev"))
            }
            var q = angular.element("#cssStyles");
            0 === q.length && (angular.element("head").append(angular.element('<style id="cssStyles"></style>')), q = angular.element("#cssStyles"));
            var r = _.debounce(function() {
                    p.html(q.html())
                }, 200),
                s = function(b, c, d) {
                    a.editMode && r(), q.html(b), "function" == typeof d && d()
                },
                t = function(a, b) {
                    b = b || [];
                    for (var c = {
                            tagName: a.prop("tagName"),
                            html: a.html(),
                            attributes: {},
                            ids: b
                        }, d = 0, e = a[0].attributes, f = e.length; d < f; d++) c.attributes[e[d].nodeName] = e[d].value;
                    for (var g = 0; b[g];) {
                        if (c.attributes[b[g]]) {
                            c.id = b[g];
                            break
                        }
                        g++
                    }
                    return c
                },
                u = function(a, b) {
                    var c = [];
                    return a && a.forEach(function(a) {
                        var b = $(a);
                        c.push(t(b, ["name", "http-equiv", "charset"]))
                    }), b && b.forEach(function(a) {
                        var b = $(a);
                        c.push(t(b, ["href"]))
                    }), c
                },
                v = function(d) {
                    a.editMode || x(d), b(d.html)(m, function(b) {
                        var d = angular.element('<div id="ms-html"><div id="ms-body"></div></div>');
                        angular.element("#ms-body", d).append(b), c(function() {
                            h.html(d), a.editMode || angular.element("body").removeAttr("style")
                        })
                    })
                },
                w = function(a) {
                    var d = angular.element("head");
                    angular.forEach(a, function(a) {
                        var e = a.tagName;
                        if ("TITLE" === e) {
                            d.find(e).html(a.html)
                        } else if (a.id)
                            if ("charset" === a.id) e += "[" + a.id + "]";
                            else {
                                a.attributes[a.id] || (a.attributes[a.id] = "emptyId");
                                var f = "<div>" + a.attributes[a.id] + "</div>";
                                b(f)(m, function(b) {
                                    c(function() {
                                        var c = b[0].innerHTML;
                                        e += "[" + a.id + '="' + c + '"]';
                                        var f = d.find(e),
                                            g = 1 === f.length;
                                        g || (f = $("<" + a.tagName + ">")), angular.forEach(a.attributes, function(b, d) {
                                            a.id === d && (b = c), f.attr(d, b)
                                        }), f.html(a.html), g || d.append(f)
                                    })
                                })
                            }
                    })
                },
                x = function(a) {
                    var b = u(a.metaTags, a.linkTags);
                    w(b)
                },
                y = function(a, b) {
                    b.editableOnPageBuilder ? $("body").removeClass("noneditable-page") : $("body").addClass("noneditable-page"), e.getTemplate(a, b.name, b.ishomepage).then(function(a) {
                        try {
                            a.metaTags = a.html.match(/<meta [^>]*>/g), a.linkTags = a.html.match(/<link [^>]*>/g), a.html = d.stripHTMLConflictingMarkup(a.html), v(a)
                        } catch (a) {
                            console.log("There was a problem in the theme html or in the content blocks..."), console.log(a)
                        }
                    })
                };
            a.$watch("themeId", function(b) {
                b && (a.editMode ? o(b).then(function() {
                    void 0 !== a.themeId && e.getTemplateSettings(a.themeId).then(function(b) {
                        a.editables = b.settings, a.themeStyles = d.cssRelativeToThePageBuilderPreview(b.styles), a.themeCompiler = b.compiler, a.editMode && C(a.themeStyles, a.themeCompiler), z()
                    })
                }) : a.editMode || e.getTemplate(b, a.page.name, a.page.ishomepage).then(function(a) {
                    s(a.styles), o(b)
                }).then(function() {
                    c(function() {
                        z()
                    })
                }))
            });
            var z = function() {
                    a.$watch("page.name", function() {
                        void 0 !== a.page && y(a.themeId, a.page)
                    })
                },
                A = !1,
                B = !0,
                C = function(b, c) {
                    A || (a.working = !0, A = !0, "less" === c ? a.$watch("editables", function(c) {
                        c && (j.$broadcast("editableChanged"), f.editablesToSettings(c).then(function(c) {
                            var d = "@theme_url:'" + m.helper.theme.url + "';\n@cdn_url:'" + m.helper.cdn.url + "';",
                                e = d + c + b;
                            f.compile2Css(e).then(function(b) {
                                b.err && (console.log(b.err), console.log(e)), s(b.css), a.working = !1
                            })
                        }))
                    }, !0) : "scss" === c ? (g.storeScss(b), a.$watch("editables", function(c) {
                        c && (j.$broadcast("editableChanged"), g.editablesToSettings(c).then(function(c) {
                            var d = "$theme_url:'" + m.helper.theme.url + "';\n$cdn_url:'" + m.helper.cdn.url + "';",
                                e = g.simplifyScss(),
                                f = d + c + e;
                            B && (f = d + c + b), g.compile2Css(f).then(function(b) {
                                b.message && (g.compressScssFailed("simplified"), console.log(b), console.log(f)), s(b, B), B = !1, a.working = !1
                            })
                        }))
                    }, !0)) : (a.working = !1, console.log("Unknown compiler", c)))
                }
        }
    }
}]), angular.module("msContentItemsLayout").factory("TemplateLoaderDirectiveHelpers", ["$q", "Config", function(a, b) {
    var c = function(a) {
        var b = "";
        return angular.forEach(a.pages, function(a) {
            "shop" === a.type && (b = a.url)
        }), b
    };
    return {
        stripHTMLConflictingMarkup: function(a) {
            return a.replace(/<[\/]{0,1}(body|BODY|html|HTML|meta|META|link|LINK|title|TITLE)[^><]*>/g, "")
        },
        cssRelativeToThePageBuilderPreview: function(a) {
            return a = a.replace(new RegExp("body ", "g"), "#ms-body "), a = a.replace(new RegExp("html ", "g"), "#ms-html ")
        },
        getHelpersForTheTemplate: function(d, e) {
            var f = a.defer(),
                g = {};
            return g.theme = {}, g.theme.url = b.GetEndPoint("themesEndpoint") + d.siteId + "/" + e + "/", g.cdn = {}, g.cdn.url = b.GetEndPoint("themesEndpoint"), g.site = {}, g.site.name = d.settings.siteName, g.menu = d.menu, g.date = new Date, g.shopUrl = c(d), f.resolve(g), f.promise
        }
    }
}]), angular.module("msFilter", []), angular.module("msFilter").filter("removeInvalidChars", function() {
    return function(a) {
        return a.replace(/[^a-zA-Z\s]/g, " ")
    }
}).filter("htmlToPlainText", function() {
    return function(a) {
        return String(a).replace(/<[^>]+>/gm, "")
    }
}).filter("fixedOrder", function() {
    return function(a) {
        return a ? Object.keys(a) : []
    }
}).filter("cleanUrl", function() {
    return function(a) {
        if (a) return a.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "")
    }
}).filter("unsafe", ["$sce", function(a) {
    return function(b) {
        return a.trustAsHtml(b)
    }
}]).filter("addAnotherFilterHere", function() {
    return function(a) {
        return a + "s"
    }
}).filter("safeUrl", ["$sce", function(a) {
    return function(b) {
        return a.trustAsResourceUrl(b)
    }
}]).filter("addEllipsis", function() {
    return function(a) {
        return a + "..."
    }
}).filter("joiner", function() {
    return function(a, b) {
        return "/" + a.join(b).toLowerCase()
    }
}), angular.module("msIdentityServer", []), angular.module("msIdentityServer").factory("IdentityServer", ["$window", "$location", "OAuthClient", "Config", function(a, b, c, d) {
    var e = function(a) {
            var b = new KJUR.jws.JWS("");
            b.parseJWS(a);
            var c = JSON.parse(b.parsedJWS.payloadS),
                d = {};
            return c.site && (d.site = c.site), c.shop && (d.shop = c.shop), d
        },
        f = function(a, e, f, g) {
            var h = "openid read write shop",
                i = "id_token token";
            c.setUrl(d.GetEndPoint("idServerEndpoint") + "/core/connect/authorize");
            var j = c.createImplicitFlowRequest(a, "default", b.protocol() + "://" + b.host() + ":" + b.port(), h, i),
                k = j.url;
            return e && (k += "&css=" + encodeURIComponent(e)), f && g && (k += "&username=" + encodeURIComponent(f) + "&password=" + encodeURIComponent(g)), k
        },
        g = function() {
            a.location.href = f("implicitclient")
        },
        h = function() {
            $("#diviframeLogin").remove(), $(window).off("message.idServer")
        },
        i = function(a, b, c, d) {
            var e = '<iframe id="iframeLogin" style="display:none;position: absolute;width: 30%;height: 90%;top: 5%;left: 35%;" src="' + a + '" />',
                f = $('<div id="diviframeLogin">' + e + "</div>");
            $("body").append(f), $(window).on("message.idServer", function(a) {
                var b = a.originalEvent.data;
                if ("loginsuccess" === b.type) {
                    var e = {
                        scope: a.originalEvent.data.scope,
                        accessToken: a.originalEvent.data.accessToken,
                        idToken: a.originalEvent.data.identityToken
                    };
                    o(e, c, function() {})
                }
                "cancel" === b.type && h(), "loginerror" === b.type && d(b)
            }), $("#iframeLogin").load(function() {
                b || $("#iframeLogin").fadeIn("fast")
            })
        },
        j = function(a, b, c) {
            var d = f("implicittrustedclient", a);
            i(d, !1, b, c)
        },
        k = function(a, b, c, d) {
            var e = f("implicittrustedclient", void 0, c, d);
            i(e, !0, a, function(a) {
                h(), b(a)
            })
        },
        l = function(a) {
            var b = '<iframe id="iframeLogout" style="" src="' + d.GetEndPoint("idServerEndpoint") + '/core/logout" />',
                c = $('<div id="diviframeLogin">' + b + "</div>");
            $("body").append(c), $("#iframeLogout").load(function() {
                $("#diviframeLogin").remove(), a && a()
            })
        },
        m = function() {
            a.location.href = f("implicittrustedclient")
        },
        n = function() {
            var a = b.path().substring(1);
            return c.parseResult(a)
        },
        o = function(a, b, c) {
            if (a.scope.indexOf("read") >= 0 && a.scope.indexOf("write") >= 0) {
                var d = e(a.idToken);
                b(a.accessToken, a.idToken, d)
            } else c()
        },
        p = function(a, b) {
            var c = n();
            if (c && c.scope) {
                o({
                    scope: c.scope,
                    accessToken: c["access_token"],
                    idToken: c["id_token"]
                }, a, b)
            }
        },
        q = function(a) {
            return c.setUrl(d.GetEndPoint("idServerEndpoint") + "/core/connect/switch"), c.createImplicitFlowRequest(a, "default", b.protocol() + "://" + b.host() + ":" + b.port() + "/#/authorize", "openid profile read write email mr_site", "id_token token").url
        };
    return {
        redirectToIdentityServer: function(b) {
            a.location.href = q(b)
        },
        getClaimsFromToken: e,
        redirectToLoginServerWithoutIFrame: g,
        closeWindow: h,
        redirectToLoginServer: j,
        loginServer: k,
        redirectToLogout: l,
        redirectToLoginServerTrusted: m,
        ValidateTokens: p
    }
}]), angular.module("msIdentityServer").factory("ImplicitFlow", ["IdServerRestangular", "QueryStringParametersManager", "$q", function(a, b, c) {
    return {
        extractAccessTokenAndSiteId: function() {
            var d = c.defer(),
                e = b.getParametersOnHash();
            if (e) {
                var f = e.access_token;
                if (!f) return d.resolve({
                    success: !1
                }), d.promise;
                var g = e.id_token;
                if (!g) return d.resolve({
                    success: !1
                }), d.promise;
                a.setDefaultHeaders({
                    "Content-Type": "application/json; charset=utf-8",
                    Authorization: "Bearer " + f
                });
                return a.one("core/connect/userinfo").get().then(function(a) {
                    var b;
                    Array.isArray(a.data.siteid) || (b = a.data.siteid), d.resolve({
                        success: !0,
                        siteId: b,
                        accessToken: f,
                        idToken: g,
                        sub: a.data.sub
                    })
                }), d.promise
            }
        }
    }
}]), angular.module("msIdentityServer").factory("QueryStringParametersManager", [function() {
    return {
        getParametersOnHash: function() {
            var a = location.hash,
                b = a.lastIndexOf("#");
            if (b !== a.indexOf("#")) {
                for (var c = a.substring(b + 1), d = c.split("&"), e = {}, f = 0; d[f]; f++) {
                    var g = d[f],
                        h = g.split("=");
                    e[h[0]] = h[1]
                }
                return e
            }
        }
    }
}]), angular.module("msIdentityServer").factory("OAuthClient", [function() {
    var a = function(a) {
            d.url = a
        },
        b = function(a, b, c, d, e) {
            e = e || "token";
            var f = (Date.now() + Math.random()) * Math.random();
            f = f.toString().replace(".", "");
            var g = (Date.now() + Math.random()) * Math.random();
            return g = g.toString().replace(".", ""), {
                url: this.url + "?client_id=" + encodeURIComponent(a) + "&tenant=" + encodeURIComponent(b) + "&redirect_uri=" + encodeURIComponent(c) + "&response_type=" + encodeURIComponent(e) + "&scope=" + encodeURIComponent(d) + "&state=" + encodeURIComponent(f) + "&nonce=" + encodeURIComponent(g),
                state: f,
                nonce: g
            }
        },
        c = function(a) {
            for (var b, c = {}, d = /([^&=]+)=([^&]*)/g; b = d.exec(a);) c[decodeURIComponent(b[1])] = decodeURIComponent(b[2]);
            return c
        },
        d = {
            setUrl: a,
            createImplicitFlowRequest: b,
            parseResult: c
        };
    return d
}]), angular.module("msIdentityServer").factory("TokenSigningCertificate", ["$http", "Config", function(a, b) {
    var c = b.GetEndPoint("idServerEndpoint") + "/core/.well-known/jwks";
    return a.get(c).then(function(a) {
        return a.data.keys[0].x5c[0]
    })
}]), angular.module("msAuthentication", ["msRestangular", "msIdentityServer", "msSiteRepository"]), angular.module("msAuthentication").factory("$auth", ["SiteRestangular", "ShopRestangular", "BlogRestangular", "DiscussionRestangular", "$window", "Config", "$location", "IdentityServer", "$authSiteExtension", "$rootScope", "$q", "IdServerRestangular", "$sessionStorage", function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n, o = !1,
        p = function() {
            return void 0 === m.get("token") || "" === m.get("token").trim() ? o && (o = !1, x(), A()) : o && n === e.sessionStorage.token || (n = m.get("token"), o = !0, A()), o
        },
        q = function(a) {
            if (!a) return void(j.userInfo = {});
            l.setDefaultHeaders({
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Bearer " + a
            }), l.one("core/connect/userinfo").get().then(function(a) {
                var b;
                Array.isArray(a.data.siteid) || (b = a.data.siteid), j.userInfo = {
                    siteId: b,
                    email: a.data.email
                }
            })
        },
        r = function(a) {
            a = a || {};
            var b = a.clientId,
                c = a.tenant,
                d = a.provider,
                h = a.scopes || "read+write+openid+mrsite+email",
                i = a.redirectUri;
            if (i && 0 !== i.indexOf("http")) {
                var j = g.protocol() + "://" + g.host();
                g.port() && 80 !== g.port() && (j += ":" + g.port()), i = j + i
            }
            var k = f.GetEndPoint("idServerEndpoint") + "/core/connect/switch?client_id=" + b + "&scope=" + h + "&response_type=id_token+token&nonce=123213123&redirect_uri=" + i,
                l = "";
            c && (l += "tenant:" + c + "+"), d && (l += "idp:" + d + "+"), "" !== l && (k += "&acr_values=" + l), e.location.href = k
        },
        s = function(a) {
            var b = {
                clientId: "mrsite-" + m.get("siteId"),
                tenant: "mrsite-" + m.get("siteId"),
                redirectUri: "/%23!%2FimplicitCallback%23",
                provider: a
            };
            r(b)
        },
        t = function(a, b) {
            var c = f.GetEndPoint("accountCentreEndpoint");
            e.location.href = c
        },
        u = "dash",
        v = function(a) {
            u = a
        },
        w = function(a, b) {
            h.loginServer(y, B, a, b)
        },
        x = function(a) {
            m.put("token", ""), m.put("idToken", ""), A()
        },
        y = function(a, b, c) {
            h.closeWindow(), z("token", a), z("idToken", b), z("siteId", c.site), z("sub", c.sub), A().then(function() {
                g.url("/" + u)
            })
        },
        z = function(a, b) {
            a && (b ? m.put(a, b) : m.remove(a))
        },
        A = function() {
            var a = k.defer();
            return j.$broadcast("auth:tokenChange", {
                accessToken: m.get("token"),
                idToken: m.get("idToken"),
                headers: C()
            }), q(m.get("token")), j.$broadcast("auth:siteIdChange", {
                siteId: m.get("siteId")
            }), i.extractExtensionsFromSite().then(function(b) {
                z("shopId", b.shopid), z("blogId", b.blogid), j.$broadcast("auth:shopIdChange", {
                    shopId: m.get("shopId")
                }), j.$broadcast("auth:siteIdChange", {
                    siteId: m.get("siteId")
                }), j.$broadcast("auth:blogIdChange", {
                    blogId: m.get("blogId")
                }), a.resolve()
            }), a.promise
        },
        B = function(a) {},
        C = function() {
            var a = {};
            return a["Content-Type"] = "application/json; charset=utf-8", m.get("token") && (a.Authorization = "Bearer " + m.get("token")), m.get("idToken") && (a["Authorization-Id"] = "Bearer " + m.get("idToken")), a
        };
    return {
        setRedirectTo: v,
        isLoggedIn: p,
        login: w,
        logout: x,
        setTokensAndSiteId: function(a, b, c, d) {
            y(a, b, {
                site: c,
                sub: d
            })
        },
        redirectToAccountCentre: t,
        redirectToIdServerFromClientSite: s,
        redirectToIdServer: r
    }
}]).factory("$authSiteExtension", ["$q", "SiteRepository", function(a, b) {
    return {
        extractExtensionsFromSite: function(c) {
            var d = a.defer();
            return b.getSite(c).then(function(a) {
                d.resolve(a.extensions)
            }), d.promise
        }
    }
}]), angular.module("msLogin", ["msAuthentication"]), angular.module("msLogin").directive("msLoginButton", ["$auth", "$rootScope", function(a, b) {
    return {
        restrict: "A",
        replace: !0,
        scope: {
            settings: "="
        },
        template: '<div><button ng-if="!logged&&!internalSettings.hideLogin" ng-click="goIdServer()">Login</button><span ng-if="logged&&!internalSettings.hideLogout">Welcome {{userInfo.email}}! <button ng-click="logout()">Logout</button></span></div>',
        link: function(c, d) {
            c.internalSettings = c.settings || {}, b.$watch("userInfo", function(a) {
                c.userInfo = a
            });
            var e = function() {
                c.logged = a.isLoggedIn()
            };
            b.$on("auth:tokenChange", e), e(), c.logout = function() {
                a.logout()
            }, c.goIdServer = function() {
                a.redirectToIdServerFromClientSite(c.internalSettings.provider)
            }
        }
    }
}]), angular.module("msLogin").directive("msLoginPopup", ["$auth", "$rootScope", "$window", "ngDialog", "Config", function(a, b, c, d, e) {
    return {
        restrict: "A",
        replace: !0,
        scope: {
            settings: "="
        },
        link: function(b, f) {
            b.internalSettings = b.settings || {}, b.showPopup = !1;
            var g = b.internalSettings.provider;
            b.showCancel = !1, b.goIdServer = function() {
                b.redirectUrl ? c.location.href = b.redirectUrl : b.internalSettings.idServer ? (b.internalSettings.idServer.provider = g, a.redirectToIdServer(b.internalSettings.idServer)) : a.redirectToIdServerFromClientSite(g)
            }, b.cancel = function() {
                b.showPopup = !1, a.logout()
            }, b.$on("login:openPopup", function(a, c) {
                c = c || {}, g = c.provider || b.internalSettings.provider, b.showCancel = c.showCancel, b.redirectUrl = c.redirectUrl, d.open({
                    template: e.GetSessionStoredValue("modulesDirectory") + "/msLogin/loginPopup.tpl.html",
                    scope: b,
                    closeByDocument: !1
                })
            })
        }
    }
}]), angular.module("msMetaDataRepository", ["msRestangular", "msConfig"]), angular.module("msMetaDataRepository").factory("MetaDataRepository", ["MetaDataRestangular", "$q", function(a, b) {
    return {
        getMetaDataByScopeTypeAndTypeId: function(c, d, e) {
            var f = b.defer();
            return a.one(c + "/" + d + "/" + e).get().then(function(a) {
                f.resolve(a.data)
            }, function(a) {
                f.reject(a)
            }), f.promise
        },
        updateMetaDataProperties: function(c, d, e, f) {
            var g = b.defer(),
                h = {
                    Scope: c,
                    Type: d,
                    TypeId: e,
                    MetaProperties: f
                };
            return a.all("").customPUT(h).then(function(a) {
                g.resolve(!0)
            }), g.promise
        },
        deleteMetaDataProperties: function(c, d, e, f) {
            var g = b.defer(),
                h = {
                    Scope: c,
                    Type: d,
                    TypeId: e,
                    MetaProperties: f
                };
            return a.all("").customDELETE(h).then(function(a) {
                g.resolve(!0)
            }), g.promise
        }
    }
}]), angular.module("msMetaData", ["msMetaDataRepository"]), angular.module("msMetaData").directive("metaDataDirective", ["$compile", "MetaDataManager", "MetaDataRepository", "Config", "$q", function(a, b, c, d, e) {
    return {
        scope: {
            scope: "@",
            type: "@",
            typeId: "@"
        },
        restrict: "AE",
        templateUrl: d.GetSessionStoredValue("modulesDirectory") + "/msMetaData/msMetaData.tpl.html",
        link: function(a, d, e) {
            var f = function() {
                if (g.scope && g.type) {
                    var b = [];
                    for (var d in a.properties)
                        if (a.properties.hasOwnProperty(d)) {
                            var e = a.properties[d];
                            e.Name = d, b.push(e)
                        } c.updateMetaDataProperties(g.scope, g.type, g.typeId, b).then(function(a) {})
                }
            };
            a.onChange = _.debounce(f, 1e3), a.properties = [];
            var g = {},
                h = function() {
                    a.scope && a.type && a.typeId && (g.scope === a.scope && g.type === a.type && g.typeId === a.typeId || (g.scope = b.getScope(a.scope), g.type = a.type, g.typeId = a.typeId, c.getMetaDataByScopeTypeAndTypeId(g.scope, g.type, g.typeId).then(function(b) {
                        angular.forEach(b.MetaProperties, function(b) {
                            b && b.Name && (a.properties[b.Name] ? a.properties[b.Name].Value = b.Value : a.properties[b.Name] = {
                                Value: b.Value
                            })
                        })
                    })))
                };
            a.$watch("scope", h), a.$watch("type", h), a.$watch("typeId", h)
        }
    }
}]).factory("MetaDataManager", ["Config", "MetaDataRepository", function(a, b) {
    var c = function(b) {
            switch (b) {
                case "shop":
                    return "shop-" + a.GetSessionStoredValue("shopId");
                case "site":
                    return "site-" + a.GetSessionStoredValue("siteId");
                case "blog":
                    return "blog-" + a.GetSessionStoredValue("blogId")
            }
            return b
        },
        d = function(a, e, f, g, h, i, j) {
            if (!f) return h && angular.element("head").find("meta[name=description]").attr("content", h), g ? angular.element("title").html(g + " | " + i) : angular.element("title").html(e + " | " + i), void(j && (angular.element("head").find("link[id=favicon]").attr("href", j), angular.element("head").find("link[id=apple-touch-icon]").attr("href", j)));
            var k = c(a);
            b.getMetaDataByScopeTypeAndTypeId(k, e, f).then(function(a) {
                angular.forEach(a.MetaProperties, function(a) {
                    a && a.Name && a.Value && ("PageTitle" === a.Name ? (angular.element("title").html(a.Value + " | " + i), angular.element("head").find("meta[name=ogtitle]").attr("content", a.Value + " | " + i), angular.element("head").find("meta[name=ogsitename]").attr("content", i || a.Value)) : "PageDescription" === a.Name && (angular.element("head").find("meta[name=description]").attr("content", a.Value), angular.element("head").find("meta[name=ogdescription]").attr("content", a.Value)))
                }), j && (angular.element("head").find("link[id=favicon]").attr("href", j), angular.element("head").find("link[id=apple-touch-icon]").attr("href", j))
            }, function(b) {
                f && d(a, e, void 0, g, h, i, j)
            })
        };
    return {
        getScope: c,
        injectMetaDataInPage: d
    }
}]), angular.module("msSiteAngularModules", ["msTemplateLoader", "msPageBuilderManager", "msFilter", "msAuthentication", "msLogin", "msMetaData"]), angular.module("msSiteAngular.pageViewer", ["msResourceUrlManager", "msPageBuilderManager", "msTemplateLoader", "ngRoute", "msFilter", "msMetaData"]).config(["$routeProvider", function(a) {
    a.when("/:pageId?/:param1?/:param2?/:param3?/:param4?", {
        template: '<div id="ms-preview" ms-template-loader-directive="" images="images" page="page" theme-id="themeId" settings="settings"></div>',
        controller: "PageViewerController"
    })
}]), angular.module("msSiteAngular.pageViewer").controller("PageViewerController", ["ResourceUrlManager", "$scope", "$routeParams", "PageBuilderManager", "$location", "$interval", "Config", "$window", "$rootScope", "$http", "ProductService", "BlogRestangular", "ShopRestangular", "ImplicitFlow", "$auth", "$sessionStorage", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    var q = c.pageId;
    if ("implicitCallback" === q) return o.logout(), o.setRedirectTo("/"), void n.extractAccessTokenAndSiteId().then(function(a) {
        a && a.success ? o.setTokensAndSiteId(a.accessToken, void 0, a.siteId) : e.url("/")
    });
    var r = c.themeId;
    a.setRouteParams(c), b.settings = b.settings || {};
    var s = function() {
            d.getImages().then(function(a) {
                b.images = a
            })
        },
        t = function() {
            d.getSiteSettings().then(function(a) {
                ("localhost" === e.host() || e.host().indexOf(".clienthost.mrsite.web") >= 0) && (a.loginEnabled = !0), b.settings = a
            })
        },
        u = function() {
            d.getCurrentTheme(q).then(function(a) {
                b.themeId = r || a.id, d.setCurrentPage(q).then(function(a) {
                    d.getWebsiteData().then(function(a) {
                        i.siteData = a
                    }), a || d.getPages().then(function(a) {
                        var b = !1,
                            c = h.location.href,
                            d = i.siteData.jsRedirects;
                        angular.forEach(d, function(a) {
                            c === a.OriginalUrl && (h.location.href = a.NewUrl)
                        }), angular.forEach(a, function(a) {
                            a && a.ishomepage && (e.path(a.url), b = !0)
                        }), !b && a[0] && e.path(a[0].url)
                    }), b.page = a || {}, b.page.editable = !1
                })
            })
        };
    i.$watch("siteData.extensions.shopid", function(a) {
        if (p.put("shopId", a), i.$broadcast("auth:shopIdChange", {
                shopId: a
            }), a && a.length > 30 && i.siteData) {
            for (var b = !1, c = 0; i.siteData.pages[c]; c++) "shop" === i.siteData.pages[c].type && (b = !0);
            b && f(k.getAll, 1e3, 1)
        }
        i.siteData && (p.put("siteId", i.siteData.siteId), i.$broadcast("auth:siteIdChange", {
            siteId: i.siteData.siteId
        }))
    }), i.$watch("siteData.extensions.blogid", function(a) {
        p.put("blogId", a), i.$broadcast("auth:blogIdChange", {
            blogId: a
        })
    }), t(), s(), u()
}]), angular.module("msAngular.implicitCallback", ["ngRoute"]).config(["$routeProvider", function(a) {
    a.when("/implicitCallback", {
        templateUrl: "/presentation/implicitCallback/implicitCallback.html",
        controller: "implicitCallbackCtrl"
    })
}]), angular.module("msAngular.implicitCallback").controller("implicitCallbackCtrl", ["ImplicitFlow", "$auth", "$location", function(a, b, c) {
    b.logout(), b.setRedirectTo("/"), a.extractAccessTokenAndSiteId().then(function(a) {
        a && a.success ? b.setTokensAndSiteId(a.accessToken, void 0, a.siteId) : c.url("/")
    })
}]), angular.module("msSiteAngular", ["ngSanitize", "msSiteAngular.config", "msSiteAngular.precache", "msConfig", "msLogin", "msAuthentication", "msSiteAngular.pageViewer", "msAngular.implicitCallback", "swxSessionStorage", "angular-momentjs"]).config(["$routeProvider", "$locationProvider", function(a, b) {
    b.html5Mode(!0).hashPrefix("!"), a.otherwise({
        redirectTo: "/"
    })
}]).run(["Config", "ShopService", "$rootScope", "$location", "$auth", function(a, b, c, d, e) {
    a.GetEndPoint("siteApiEndpoint"), c.$on("restangular:needLogin", function(a) {
        c.$broadcast("login:openPopup", {
            showCancel: !0
        })
    }), c.$on("$routeChangeStart", function(a, b) {
        "/register" === d.path() && "/sitecreation" === d.path() || (b.resolve = angular.extend(b.resolve || {}, {
            __authenticating__: e.isLoggedIn
        }))
    }), b.SetAppCurrencyFromShopSettings()
}]);
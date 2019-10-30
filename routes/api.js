var request = require("request");
var cheerio = require("cheerio");
var Iconv = require('iconv-lite');
const puppeteer = require('puppeteer');
var https = require('https');
const MAX_WSE = 4;  //启动几个浏览器 
let WSE_LIST = []; //存储browserWSEndpoint列表
// init();
//轮播图
// http://www.bimibimi.tv/template/bimibimi_pc/images/grey.png --等待加载图
exports.carousel = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var carouselHtml = $(".banner-box");
				if(!isnull(carouselHtml)){
					carouselHtml.find("li").map(function(i, v) {
						var umguri = "";
						if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
							umguri = $(v).find("img").attr("src");
							if (umguri.indexOf("http") == -1) {
								umguri = "http://www.bimibimi.tv" + umguri;
							}
						}
						result.push({
							img: umguri,
							url: (isnull($(v).find("a"))?"":"http://www.bimibimi.tv" + $(v).find("a").attr("href")),
							title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt"))
						});
					});
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//轮播后推荐
exports.sliderRecom = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var sliderrecomHtml = $(".slider-menu");
				if(!isnull(sliderrecomHtml)){
					sliderrecomHtml.find("li").map(function(i, v) {
						var umguri = "";
						if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
							umguri = $(v).find("img").attr("src");
							if (umguri.indexOf("http") == -1) {
								umguri = "http://www.bimibimi.tv" + umguri;
							}
						}	
						result.push({
							img: umguri,
							url: (isnull($(v).find("a"))?"":"http://www.bimibimi.tv" + $(v).find("a").attr("href")),
							title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
							number: (isnull($(v).find(".text-box span"))?"":$(v).find(".text-box span").text())
						});
					});
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//一周更新
exports.weekUpdate = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var weekUpdatesHtml = $(".tab-cont__wrap");
				if(!isnull(weekUpdatesHtml)){
					weekUpdatesHtml.find(".item").map(function(i, v) {
						var updateList = [];
						$(v).find(".bangumi-item").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
								umguri = $(v).find("img").attr("src");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}	
							
							updateList.push({
								updateDate: (isnull($(v).find("span"))?"":$(v).find("span").text()),
								name: (isnull($(v).find(".item-info a"))?"":$(v).find(".item-info a").text()),
								url: (isnull($(v).find(".item-info a"))?"":"http://www.bimibimi.tv" + $(v).find(".item-info a").attr("href")),
								img: umguri,
							});
						});
						var week = '';
						switch (i + 1) {
							case 1:
								week = "一";
								break;
							case 2:
								week = "二";
								break;
							case 3:
								week = "三";
								break;
							case 4:
								week = "四";
								break;
							case 5:
								week = "五";
								break;
							case 6:
								week = "六";
								break;
							case 7:
								week = "日";
								break;
						}
						result.push({
							week: week,
							list: updateList
						});
					});
				}	
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}


};

//今日热播
exports.todayHot = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var todayhotHtml = $(".drama-module").eq(0);
					if(!isnull(todayhotHtml)){
						todayhotHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
								number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text())
							});
						});
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//月排行榜
exports.monthRank = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var monthrankHtml = $(".rank-content");
				if(!isnull(monthrankHtml)){
					monthrankHtml.find("li").map(function(i, v) {
						result.push({
							rank: (isnull($(v).find("i"))?"":$(v).find("i").text()),
							url: (isnull($(v).find("a"))?"":"http://www.bimibimi.tv" + $(v).find("a").attr("href")),
							title: (isnull($(v).find("a"))?"":$(v).find("a").attr("title")),
							number: (isnull($(v).find("span"))?"":$(v).find("span").text())
						});
					});
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//新番发送
exports.newAnimate = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var newAnimateHtml = $(".drama-module").eq(1);
					if(!isnull(newAnimateHtml)){
						newAnimateHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}
							
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
								number: (isnull($(v).find("span"))?"":$(v).find("span").text())
							});
						});
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//国产动漫
exports.chinaAnimate = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var chinaAnimateHtml = $(".drama-module").eq(2);
					if(!isnull(chinaAnimateHtml)){
						chinaAnimateHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}	
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
								number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
							});
						});
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//番组计划
exports.animatePlan = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var animatePlanHtml = $(".drama-module").eq(3);
					if(!isnull(animatePlanHtml)){
						animatePlanHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}	
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
								number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
							});
						});
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//剧场动画
exports.animateMovie = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var animateMovieHtml = $(".drama-module").eq(4);
					if(!isnull(animateMovieHtml)){
						animateMovieHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}	
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img").attr("alt"))?"":$(v).find("img").attr("alt")),
								info: (isnull($(v).find(".info span").text())?"":$(v).find(".info span").text())
							});
						});
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}

		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//影视
exports.Movies = function(req, res) {
	var result = [];
	try {
		request("http://www.bimibimi.tv/", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".drama-module"))){
					var moviesHtml = $(".drama-module").eq(5);
					if(!isnull(moviesHtml)){
						moviesHtml.find("li").map(function(i, v) {
							var umguri = "";
							if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
								umguri = $(v).find("img").attr("data-original");
								if (umguri.indexOf("http") == -1) {
									umguri = "http://www.bimibimi.tv" + umguri;
								}
							}	
							result.push({
								img: umguri,
								url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
								title: (isnull($(v).find("img"))?"":$(v).find("img").attr("alt")),
								info: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text())
							});
						});	
					}
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//新番发送（日漫时间2000-2019）
/*地址如：
http://www.bimibimi.tv/vodshow/riman-----------2019/
http://www.bimibimi.tv/vodshow/riman---------周一--2019/
http://www.bimibimi.tv/vodshow/riman---热血------周一--2019/
http://www.bimibimi.tv/vodshow/riman---热血--A----周一--2019/
http://www.bimibimi.tv/vodshow/riman--------2---/
http://www.bimibimi.tv/vodshow/riman--score---------2019/
*/
//年度动漫列表
exports.yearAnimateList = function(req, res) {
	var ver = req.query.ver || ""; //排行：time(时间),hits(人气),score(评分)
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //全部,热血,冒险,搞笑,运动,竞技,装逼,剧情,青春,后宫,校园,励志,恋爱,百合,耽美,战斗,机战,科幻,萝莉,奇幻,魔法,动画,治愈,美食,萌系,偶像,泡面,漫改,轻改,催泪,日常,少儿,少女,社团,推理,乙女,其他
	var page = req.query.page || 1;
	//var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var week = req.query.week || ""; //全部,周一,周二,周三,周四,周五,周六,周日
	var year = req.query.year || ""; //2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000

	var url = "http://www.bimibimi.tv/vodshow/riman--$ver-$sort--$letter---$page-$week--$year/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	try {
		url = encodeURI(url.replace("$ver", ver).replace("$sort", sort).replace("$letter", letter).replace("$week", week).replace(
			"$year", year).replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					// console.log("lasturi:"+lasturi);
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var findex = find(wyuri,"-",7);//第八次和第九次之间的就是总共的页数
							var lindex = find(wyuri,"-",8);
							var tpage = wyuri.substring(findex+1, lindex); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								// count = $(".v_num em").text(); //新番总量
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
												img: umguri,
												name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
												info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
												number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}
					}
					else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}
							 
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
											umguri = $(v).find("img").attr("data-original");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										result.list.push({
											url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
											img: umguri,
											name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
											info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
											number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
										});
									});
								}
								res.send(result);
							}
						}
					}
				}
				// res.send(result);
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//国漫（时间2000-2019）
/*地址如：
http://www.bimibimi.tv/vodshow/guoman-----------2019/
http://www.bimibimi.tv/vodshow/guoman---------周一--2019/
http://www.bimibimi.tv/vodshow/guoman---热血------周一--2019/
http://www.bimibimi.tv/vodshow/guoman---热血--A----周一--2019/
http://www.bimibimi.tv/vodshow/guoman--------2---/
http://www.bimibimi.tv/vodshow/guoman--score---------2019/
*/
//国漫年度动漫列表
exports.guoManAnimateList = function(req, res) {
	var ver = req.query.ver || ""; //排行：time(时间),hits(人气),score(评分)
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //全部,热血,冒险,搞笑,运动,竞技,装逼,剧情,青春,后宫,校园,励志,恋爱,百合,耽美,战斗,机战,科幻,萝莉,奇幻,魔法,动画,治愈,美食,萌系,偶像,泡面,漫改,轻改,催泪,日常,少儿,少女,社团,推理,乙女,其他
	var page = req.query.page || 1;
	//var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var week = req.query.week || ""; //全部,周一,周二,周三,周四,周五,周六,周日
	var year = req.query.year || ""; //2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000

	var url = "http://www.bimibimi.tv/vodshow/guoman--$ver-$sort--$letter---$page-$week--$year/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	try {
		url = encodeURI(url.replace("$ver", ver).replace("$sort", sort).replace("$letter", letter).replace("$week", week).replace(
			"$year", year).replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var findex = find(wyuri,"-",7);//第八次和第九次之间的就是总共的页数
							var lindex = find(wyuri,"-",8);
							var tpage = wyuri.substring(findex+1, lindex); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								// count = $(".v_num em").text(); //新番总量
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
												img: umguri,
												name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
												info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
												number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}	
					}
					else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}	
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
											umguri = $(v).find("img").attr("data-original");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										result.list.push({
											url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
											img: umguri,
											name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
											info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
											number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
										});
									});
								}
								res.send(result);
							}
						}	
					}
				}
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//番组（时间2000-2019）
/*地址如：
http://www.bimibimi.tv/vodshow/fanzu-----------2019/
http://www.bimibimi.tv/vodshow/fanzu---------周一--2019/
http://www.bimibimi.tv/vodshow/fanzu---热血------周一--2019/
http://www.bimibimi.tv/vodshow/fanzu---热血--A----周一--2019/
http://www.bimibimi.tv/vodshow/fanzu--------2---/
http://www.bimibimi.tv/vodshow/fanzu--score---------2019/
*/
//番组年度动漫列表
exports.fanZuAnimateList = function(req, res) {
	var ver = req.query.ver || ""; //排行：time(时间),hits(人气),score(评分)
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //全部,热血,冒险,搞笑,运动,竞技,装逼,剧情,青春,后宫,校园,励志,恋爱,百合,耽美,战斗,机战,科幻,萝莉,奇幻,魔法,动画,治愈,美食,萌系,偶像,泡面,漫改,轻改,催泪,日常,少儿,少女,社团,推理,乙女,其他
	var page = req.query.page || 1;
	//var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var week = req.query.week || ""; //全部,周一,周二,周三,周四,周五,周六,周日
	var year = req.query.year || ""; //2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000

	var url = "http://www.bimibimi.tv/vodshow/fanzu--$ver-$sort--$letter---$page-$week--$year/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	try {
		url = encodeURI(url.replace("$ver", ver).replace("$sort", sort).replace("$letter", letter).replace("$week", week).replace(
			"$year", year).replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var findex = find(wyuri,"-",7);//第八次和第九次之间的就是总共的页数
							var lindex = find(wyuri,"-",8);
							var tpage = wyuri.substring(findex+1, lindex); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								// count = $(".v_num em").text(); //新番总量
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
												img: umguri,
												name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
												info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
												number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}	
					}
					else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}	
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
											umguri = $(v).find("img").attr("data-original");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										
										result.list.push({
											url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
											img: umguri,
											name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
											info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
											number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
										});
									});
								}
								res.send(result);
							}
						}	
					}
				}	
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//剧场动画（时间2000-2019）
/*地址如：
http://www.bimibimi.tv/vodshow/juchang-----------2019/
http://www.bimibimi.tv/vodshow/juchang---------周一--2019/
http://www.bimibimi.tv/vodshow/juchang---热血------周一--2019/
http://www.bimibimi.tv/vodshow/juchang---热血--A----周一--2019/
http://www.bimibimi.tv/vodshow/juchang--------2---/
http://www.bimibimi.tv/vodshow/juchang--score---------2019/
*/
//剧场动画年度动漫列表
exports.juChangAnimateList = function(req, res) {
	var ver = req.query.ver || ""; //排行：time(时间),hits(人气),score(评分)
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //全部,热血,冒险,搞笑,运动,竞技,装逼,剧情,青春,后宫,校园,励志,恋爱,百合,耽美,战斗,机战,科幻,萝莉,奇幻,魔法,动画,治愈,美食,萌系,偶像,泡面,漫改,轻改,催泪,日常,少儿,少女,社团,推理,乙女,其他
	var page = req.query.page || 1;
	//var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var week = req.query.week || ""; //全部,周一,周二,周三,周四,周五,周六,周日
	var year = req.query.year || ""; //2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000

	var url = "http://www.bimibimi.tv/vodshow/juchang--$ver-$sort--$letter---$page-$week--$year/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	try {
		url = encodeURI(url.replace("$ver", ver).replace("$sort", sort).replace("$letter", letter).replace("$week", week).replace(
			"$year", year).replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var findex = find(wyuri,"-",7);//第八次和第九次之间的就是总共的页数
							var lindex = find(wyuri,"-",8);
							var tpage = wyuri.substring(findex+1, lindex); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								// count = $(".v_num em").text(); //新番总量
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
												img: umguri,
												name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
												info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
												number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}	
					}
					else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
											umguri = $(v).find("img").attr("data-original");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										result.list.push({
											url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
											img: umguri,
											name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
											info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
											number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
										});
									});
								}
								res.send(result);
							}
						}	
					}
				}
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//影视列表（时间2000-2019）
/*地址如：
http://www.bimibimi.tv/vodshow/move-----------2019/
http://www.bimibimi.tv/vodshow/move---------周一--2019/
http://www.bimibimi.tv/vodshow/move---热血------周一--2019/
http://www.bimibimi.tv/vodshow/move---热血--A----周一--2019/
http://www.bimibimi.tv/vodshow/move--------2---/
http://www.bimibimi.tv/vodshow/move--score---------2019/
*/
//影视年度列表
exports.moveAnimateList = function(req, res) {
	var ver = req.query.ver || ""; //排行：time(时间),hits(人气),score(评分)
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //全部,热血,冒险,搞笑,运动,竞技,装逼,剧情,青春,后宫,校园,励志,恋爱,百合,耽美,战斗,机战,科幻,萝莉,奇幻,魔法,动画,治愈,美食,萌系,偶像,泡面,漫改,轻改,催泪,日常,少儿,少女,社团,推理,乙女,其他
	var page = req.query.page || 1;
	//var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var week = req.query.week || ""; //全部,周一,周二,周三,周四,周五,周六,周日
	var year = req.query.year || ""; //2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000

	var url = "http://www.bimibimi.tv/vodshow/move--$ver-$sort--$letter---$page-$week--$year/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	try {
		url = encodeURI(url.replace("$ver", ver).replace("$sort", sort).replace("$letter", letter).replace("$week", week).replace(
			"$year", year).replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var findex = find(wyuri,"-",7);//第八次和第九次之间的就是总共的页数
							var lindex = find(wyuri,"-",8);
							var tpage = wyuri.substring(findex+1, lindex); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								// count = $(".v_num em").text(); //新番总量
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
												img: umguri,
												name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
												info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
												number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}	
					}
					else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}	
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
											umguri = $(v).find("img").attr("data-original");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										result.list.push({
											url: (isnull($(v).find(".info a"))?"":"http://www.bimibimi.tv" + $(v).find(".info a").attr("href")),
											img: umguri,
											name: (isnull($(v).find(".info a"))?"":$(v).find(".info a").attr("title")),
											info: (isnull($(v).find(".mask p"))?"":$(v).find(".mask p").text()),
											number: (isnull($(v).find(".info span"))?"":$(v).find(".info span").text()),
										});
									});
								}
								res.send(result);
							}
						}	
					}
				}
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}
};

//资讯
/* http://www.bimibimi.tv/arttype/zixun/
http://www.bimibimi.tv/arttype/zixun-2/ */
exports.zixun = function(req, res) {
	var page = req.query.page || 1;
	var url = "http://www.bimibimi.tv/arttype/zixun-$page/";
	var pageSize = 30;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
	};
	try {
		url = encodeURI(url.replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				// console.log($("#long-page").find("a").length);
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var tpage = wyuri.substring(wyuri.indexOf("-") + 1, wyuri.length - 1); //总共多少页
							httprequest(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 30 + parseInt(req);
								console.log("总共多少条" + count);
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".list_module_img li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
												umguri = $(v).find("img").attr("src");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}
											result.list.push({
												url: (isnull($(v).find(".news-info a"))?"":"http://www.bimibimi.tv" + $(v).find(".news-info a").attr("href")),
												img: umguri,
												title: (isnull($(v).find(".news-info a"))?"":$(v).find(".news-info a").attr("title")),
												publistime: (isnull($(v).find(".news-info span"))?"":$(v).find(".news-info span").text()),
												info: (isnull($(v).find(".news-info p"))?"":$(v).find(".news-info p").text()),
											});
										});
									}
									res.send(result);
								}
							})
						}	
					} else {
						count =0;
						if(!isnull($(".list_module_img li"))){
							count = $(".list_module_img li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}	
							console.log("总共多少页" + count);
							count = (tpage - 1) * 30 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".list_module_img li").map(function(i, v) {
										var umguri = "";
										if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
											umguri = $(v).find("img").attr("src");
											if (umguri.indexOf("http") == -1) {
												umguri = "http://www.bimibimi.tv" + umguri;
											}
										}	
										result.list.push({
											url: (isnull($(v).find(".news-info a"))?"":"http://www.bimibimi.tv" + $(v).find(".news-info a").attr("href")),
											img: umguri,
											title: (isnull($(v).find(".news-info a"))?"":$(v).find(".news-info a").attr("title")),
											publistime: (isnull($(v).find(".news-info span"))?"":$(v).find(".news-info span").text()),
											info: (isnull($(v).find(".news-info p"))?"":$(v).find(".news-info p").text()),
										});
									});
								}
								res.send(result);
							}
						}	
					}
				}
			} else {
				res.send(errorRequest());
			}
		});
	} catch (e) {
		res.send(errorRequest());
	}

};

//资讯详情
/* http://www.bimibimi.tv/artdetail-3/ */
exports.artDetail = function(req, res) {
	var page = req.query.page || 1;
	var url = "http://www.bimibimi.tv/artdetail-$page/";
	var result = {};
	try {
		url = encodeURI(url.replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				result.title= (isnull($(".news-title h1"))?"":$(".news-title h1").text());
				result.source= (isnull($(".news-title .news-inf span"))?"":$(".news-title .news-inf span").eq(0).text());
				result.autor= (isnull($(".news-title .news-inf span"))?"":$(".news-title .news-inf span").eq(1).text());
				result.updatetime= (isnull($(".news-title .news-inf span"))?"":$(".news-title .news-inf span").eq(2).text());
				result.hits= (isnull($(".news-title .news-inf span"))?"":$(".news-title .news-inf span").eq(3).text());//人气
				// console.log($(".news-data").innerHTML());
				result.newsinfo= (isnull($(".news-data"))?"":$(".news-data").text());
				res.send(result);
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};	


//动漫详情
/* http://www.bimibimi.tv/bangumi/bi/97/ */
exports.animateDetail = function(req, res) {
	var page = req.query.page || 1;
	var url = "http://www.bimibimi.tv/bangumi/bi/$page/";
	var result = {};
	var voicelsit = [];
	var sortlsit = [];
	var directorlsit = [];
	var arealsit = [];
	var recommendlist = [];
	try {
		url = encodeURI(url.replace("$page", page));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				result.title= $(".txt_intro_con h1").text();
				result.updatenums= $(".txt_intro_con .p_txt em").text();//更新集数
				result.rember= $(".txt_list li").eq(0).find("a").text();//提醒
				$(".txt_list li").eq(1).find("a").map(function(i, v) {
					voicelsit.push({
						url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
						voiceactor: $(v).text(),
					});
				});
				result.voicelsit= voicelsit;//声优
				
				$(".txt_list li").eq(2).find("a").map(function(i, v) {
					sortlsit.push({
						url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
						sort: $(v).text(),
					});
				});
				result.sortlsit= sortlsit;//类型
				
				$(".txt_list li").eq(3).find("a").map(function(i, v) {
					directorlsit.push({
						url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
						director: $(v).text(),
					});
				});
				result.directorlsit= directorlsit;//导演
				
				result.kaibo= $(".txt_list li").eq(4).text();//开播
				result.year= $(".txt_list li").eq(5).text();//年份
				
				$(".txt_list li").eq(6).find("a").map(function(i, v) {
					arealsit.push({
						url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
						area: $(v).text(),
					});
				});
				result.arealsit= arealsit;//地区
				
				result.language= $(".txt_list li").eq(7).text();//语言
				result.comment= $(".txt_list li").eq(8).find("span").text();//评论
				result.updatetime= $(".txt_list li").eq(9).text();//最近更新
				result.intro= $(".txt_list li").eq(10).find("p").text();//简介
				// console.log($(".player_list").length);
				var plegth = $(".player_list").length;
				var plists = [];
				for (var i = 0; i < plegth; i++) {
					var playlist = [];
					$(".player_list").eq(i).find("a").map(function(i, v) {
						playlist.push({
							url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
							playnum: $(v).text(),
						});
					});
					plists.push(playlist);
				}
				result.playlist= plists;//播放列表
				$(".drama-module li").map(function(i, v) {
					var umguri = "";
					if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
						umguri = $(v).find("img").attr("data-original");
						if (umguri.indexOf("http") == -1) {
							umguri = "http://www.bimibimi.tv" + umguri;
						}
					}	
					recommendlist.push({
						url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
						img: umguri,
						name: $(v).find(".info a").text(),
						info: $(v).find(".info p span").text(),//清晰度
						views: $(v).find(".info p em").text(),//观看人数
					});
				});
				result.recommendlist= recommendlist;//相关推荐
				
				res.send(result);
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};

// 播放相关
/* http://www.bimibimi.tv/bangumi/97/play/1/61/ */
exports.animatePlay = function(req, res) {
	var animateid = req.query.animateid || 1;//动漫标识
	var season = req.query.season || 1;//季度
	var playnum = req.query.page || 1;//第几集
	var url = "http://www.bimibimi.tv/bangumi/$animateid/play/$season/$playnum/";
	var result = {};
	var recommendlist = [];
	var player_data ={};
	try {
		url = encodeURI(url.replace("$animateid", animateid).replace("$season", season).replace("$playnum", playnum));
		console.log(url);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var videodata = $("#video").text();
				console.log(body);
				var playdata = videodata.substring(videodata.indexOf("=")+1,videodata.length);
				player_data = JSON.parse(playdata);
				result.player_data = player_data;
				/* if (playdata.encrypt == '1') {
					playdata.url = unescape(playdata.url);
					playdata.url_next = unescape(playdata.url_next)
				} else if (playdata.encrypt == '2') {
					playdata.url = unescape(base64decode(playdata.url));
					playdata.url_next = unescape(base64decode(playdata.url_next))
				} 
				result.url = getRealURL(playdata.url);//播放地址
				result.nexturl = getRealURL(playdata.url_next);//下一集*/
					
				// result.playuri= $("#video").text();
				
				result.name= $(".v_path").find("a").last().text();
				result.curnum= playnum;
				var plegth = $(".player_list").length;
				var plists = [];
				
				for (var i = 0; i < plegth; i++) {
					var playlist = [];
					$(".player_list").eq(i).find("a").map(function(i, v) {
						playlist.push({
							url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
							playnum: $(v).text(),
						});
					});
					plists.push(playlist);
				}
				result.playlist= plists;//播放列表
				
				$(".drama-module li").map(function(i, v) {
					var umguri = $(v).find("img").attr("data-original");
					if (umguri.indexOf("http") == -1) {
						umguri = "http://www.bimibimi.tv" + umguri;
					}
					recommendlist.push({
						url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
						img: umguri,
						name: $(v).find(".info a").text(),
						info: $(v).find(".info p span").text(),//清晰度
						views: $(v).find(".info p em").text(),//观看人数
					});
				});
				result.recommendlist= recommendlist;//相关推荐
				
				res.send(result);
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};

// 最新上映
/* http://www.bimibimi.tv/label/new/ */
exports.latestShowAnimate = function(req, res) {
	var url = "http://www.bimibimi.tv/label/new/";
	var result = [];
	try {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".serach-ul li"))){
					$(".serach-ul li").map(function(i, v) {
						var umguri = "";
						if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("src"))){
							umguri = $(v).find("img").attr("src");
							if (umguri.indexOf("http") == -1) {
								umguri = "http://www.bimibimi.tv" + umguri;
							}
						}	
						result.push({
							url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
							img: umguri,
							name: $(v).find(".info a").text(),
							score: $(v).find(".score").text(),//评分
							updatenums: $(v).find(".title").text(),//更新集数
							director: $(v).find(".info p").eq(0).find("on").text(),//导演
							showdate: $(v).find(".info p").eq(1).text(),//上映时间
							mainactor: $(v).find(".info p").eq(2).find("span").text(),//主演
							sort: $(v).find(".info p").eq(3).text(),//类型
							area: $(v).find(".info p").eq(4).text(),//地区
							plot: $(v).find(".info p").eq(6).text(),//剧情
						});
					});
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};

// 排行榜
/* http://www.bimibimi.tv/label/top/ */
exports.animateRank = function(req, res) {
	var url = "http://www.bimibimi.tv/label/top/";
	var result = {};
	var newAnimateRank =[];//新番放送排行榜
	var chinaAnimateRank =[];//国产动漫排行榜
	var animatePlanRank =[];//番组计划排行榜
	var movieAnimateRank =[];//剧场动画排行榜
	var newAnimateScore =[];//新番放送评分榜
	var chinaAnimateScore =[];//国产动漫评分榜
	var animatePlanScore =[];//番组计划评分榜
	var movieAnimateScore =[];//剧场动画评分榜
	try {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				if(!isnull($(".top-r .top-item"))){
					$(".top-r .top-item").map(function(i, v) {
						var htitle = "";
						if(!isnull($(v).find(".top-title h2"))){
							htitle = $(v).find(".top-title h2").text();
						}
						console.log(htitle);
						$(v).find(".top-list li").map(function(j, k) {
							if (htitle == "新番放送排行榜") {
								newAnimateRank.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.newAnimateRank = newAnimateRank;
							} else if (htitle == "国产动漫排行榜") {
								chinaAnimateRank.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.chinaAnimateRank = chinaAnimateRank;
							} else if (htitle == "番组计划排行榜") {
								animatePlanRank.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.animatePlanRank = animatePlanRank;
							} else if (htitle == "剧场动画排行榜") {
								movieAnimateRank.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.movieAnimateRank = movieAnimateRank;
							} else if (htitle == "新番放送评分榜") {
								newAnimateScore.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.newAnimateScore = newAnimateScore;
							} else if (htitle == "国产动漫评分榜") {
								chinaAnimateScore.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.chinaAnimateScore = chinaAnimateScore;
							} else if (htitle == "番组计划评分榜") {
								animatePlanScore.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.animatePlanScore = animatePlanScore;
							} else if (htitle == "剧场动画评分榜") {
								movieAnimateScore.push({
									url: "http://www.bimibimi.tv" + $(k).find("a").attr("href"),
									rank: $(k).find("span").eq(0).text(),
									title: $(k).find("span").eq(1).text(),
									score: $(k).find("span").eq(2).text(),
								});
								result.movieAnimateScore = movieAnimateScore;
							}
						});	
					});
				}
				res.send(result);
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};

//搜索
/* http://www.bimibimi.tv/vod/search/
 http://www.bimibimi.tv/vod/search/page/2/*/
exports.searchByKeyWord = function(req, res) {
	var page = req.query.page || 1;
	var keyword = req.query.keyword || "";//wd: 火影
	var url = "http://www.bimibimi.tv/vod/search/page/$page/";
	var pageSize = 24;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
	};
	try {
		url = encodeURI(url.replace("$page", page));
		// console.log(decodeURIComponent(keyword));
		// var requestData={wd:"火影"};
		// console.log(JSON.stringify(requestData));
		var options = {
			url: url,
			method: "POST",
			json: {
				wd: decodeURIComponent(keyword)
			},
			// body: JSON.stringify(requestData),
		};
		request(options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var count;
				// console.log($("#long-page").find("a").length);
				//尾页如果没有href表示最后一页
				if(!isnull($("#long-page li"))){
					var lasturi = $("#long-page li").last().find("a").attr("href");
					if (lasturi!=null&&lasturi!=""&&lasturi!=undefined) { //多页
						if(!isnull($("#long-page a"))&&!isnull($("#long-page a").last().attr("href"))){
							var wyuri = "http://www.bimibimi.tv" + $("#long-page a").last().attr("href"); //尾页uri
							var tpage = wyuri.substring(wyuri.indexOf("page/") + 5, wyuri.length - 1); //总共多少页
							httprequest2(wyuri).then(function(req) {
								console.log("最后一页的数量" + req);
								count = (tpage - 1) * 24 + parseInt(req);
								console.log("总共多少条" + count);
								if (count != null && count != "" && count != undefined && count != "0") {
									count = parseInt(count);
									var totalPage = 0;
									if (count % pageSize == 0) {
										totalPage = count / pageSize;
									} else {
										totalPage = parseInt(count / pageSize) + 1;
									}
									result.totalCount = count;
									result.totalPage = totalPage;
									result.lastPage = page == totalPage;
									result.firstPage = page == 1;
									if (count > 0) {
										$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}	
											result.list.push({
												url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
												img: umguri,
												name: $(v).find(".info a").text(),
												info: $(v).find(".info p span").text(),//清晰度、更新集数
												director: $(v).find(".mask").text(),//导演
											});
										});
									}
									res.send(result);
								}
							})
						}	
					} else {
						count =0;
						if(!isnull($(".drama-module li"))){
							count = $(".drama-module li").length;
							var tpage = 0;
							if(!isnull($("#long-page .active span"))){
								tpage = parseInt($("#long-page .active span").text()); //总共多少页
							}	
							console.log("总共多少页" + count);
							count = (tpage - 1) * 24 + parseInt(count);
							console.log("总共多少条" + count);
							if (count != null && count != "" && count != undefined && count != "0") {
								count = parseInt(count);
								var totalPage = 0;
								if (count % pageSize == 0) {
									totalPage = count / pageSize;
								} else {
									totalPage = parseInt(count / pageSize) + 1;
								}
								result.totalCount = count;
								result.totalPage = totalPage;
								result.lastPage = page == totalPage;
								result.firstPage = page == 1;
								if (count > 0) {
									$(".drama-module li").map(function(i, v) {
											var umguri = "";
											if(!isnull($(v).find("img"))&&!isnull($(v).find("img").attr("data-original"))){
												umguri = $(v).find("img").attr("data-original");
												if (umguri.indexOf("http") == -1) {
													umguri = "http://www.bimibimi.tv" + umguri;
												}
											}
											result.list.push({
												url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
												img: umguri,
												name: $(v).find(".info a").text(),
												info: $(v).find(".info p span").text(),//清晰度、更新集数
												director: $(v).find(".mask").text(),//导演
											});
										});
								}
								res.send(result);
							}
						}	
					}
				}	
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}	
};

//通过 Puppeteer 爬取动漫地址
exports.animatePlayByPT = function(req, res) {
	var animateid = req.query.animateid || 1;//动漫标识
	var season = req.query.season || 1;//季度
	var playnum = req.query.playnum || 1;//第几集
	var url = "http://www.bimibimi.tv/bangumi/$animateid/play/$season/$playnum/";
	// var result = {};
	var playlist = [];
	var recommendlist = [];
	var player_data ={};
	var reqdata = {};
	// reqdata.animateid = animateid;
	// reqdata.season = season;
	// reqdata.playnum = playnum;
	// console.log("reqdata:"+reqdata);
	try {
		url = encodeURI(url.replace("$animateid", animateid).replace("$season", season).replace("$playnum", playnum));
		console.log(url);
		// 等待3000毫秒
		 const sleep = time => new Promise(resolve => {
		     setTimeout(resolve, time);
		 })
		 // let tmp = Math.floor(Math.random()* MAX_WSE);
		// const url1 = 'https://movie.douban.com/explore#!type=movie&tag=%E7%BB%8F%E5%85%B8&sort=rank&page_limit=20&page_start=0';
		;(async() => {
			console.log('Start visit');
			let starttime = new Date().getTime();
			// 启动一个浏览器
			const brower = await puppeteer.launch({
					args: ['--no-sandbox',
							'–disable-gpu',
							'–disable-dev-shm-usage',
							'–disable-setuid-sandbox',
							'–no-first-run',
							'–no-sandbox',
							'–no-zygote',
							'–single-process'],
					dumpio: false
				});
			try {
				
				// let browserWSEndpoint = WSE_LIST[tmp];
				// const browser = await puppeteer.connect({browserWSEndpoint});
				const page = await brower.newPage()   // 开启一个新页面
				// 去豆瓣那个页面
				await page.goto(url, {
					waitUntil: 'networkidle2'  // 网络空闲说明已加载完毕
				});
				// 设置页面大小
				/* await page.setViewport({
				            width: 600,
				            height: 400
				        }); */
				await sleep(500);
				// console.log(page)
				// 页面加载更多按钮出现
				await page.waitForSelector('#playleft');
			
				// 只爬取两页的数据
				/* for (let i = 0; i < 1; i++) {
					await sleep(3000);
					// 点击加载更多
					await page.click('.more')
				} */
				// var pageurl = page.url();
				
				// console.log(playnum);
				// 结果
				const result = await page.evaluate((playnum) => {
					// 拿到页面上的jQuery
					var $ = window.$;
					let pageurl = window.location.href;
					var ret = {};
					let uri = $("#playleft iframe").attr("src")||"没有解析到页面播放地址"
					ret.playurl = uri;
					var videodata = "";
					var playdata ="";
					if($(".player_zanpian")!=null&&$(".player_zanpian")!=""&&$(".player_zanpian")!=undefined){
						videodata = $(".player_zanpian").eq(0).text();
						if(videodata!=null&&videodata!=""&&videodata!=undefined){
							if(videodata.indexOf("=")!=-1&&videodata.indexOf(".MacPlayer")!=-1){
								playdata = videodata.substring(videodata.indexOf("=")+1,videodata.indexOf(".MacPlayer"));
								player_data = JSON.parse(playdata);
								ret.player_data = player_data;
							}
						}
					}
					// console.log(videodata);
					// console.log(playdata);
					// var playnum = playnum;
					var recommendlist = [];
					var player_data ={};
					ret.name= $(".v_path").find("a").last().text();
					var playnum = "";
					if(pageurl!=null&& pageurl!="" && pageurl!=undefined && pageurl.indexOf("play")!=-1){
						playnum = pageurl.substring(pageurl.indexOf("play")+7,pageurl.length-1);
						ret.curnum= playnum;//第几集
					}
					
					
					/* var plegth = $(".player_list").length;
					var plists = [];
					
					for (var i = 0; i < plegth; i++) {
						var playlist = [];
						$(".player_list").eq(i).find("a").map(function(i, v) {
							playlist.push({
								url: "http://www.bimibimi.tv/"+ $(v).attr("href"),
								playnum: $(v).text(),
							});
						});
						plists.push(playlist);
					}
					ret.playlist= plists;//播放列表
					
					$(".drama-module li").map(function(i, v) {
						var umguri  = $(v).find("img").attr("data-original");
						if (umguri.indexOf("http") == -1) {
							umguri = "http://www.bimibimi.tv" + umguri;
						}
						recommendlist.push({
							url: "http://www.bimibimi.tv" + $(v).find(".info a").attr("href"),
							img: umguri,
							name: $(v).find(".info a").text(),
							info: $(v).find(".info p span").text(),//清晰度
							views: $(v).find(".info p em").text(),//观看人数
						});
					});
					ret.recommendlist= recommendlist;//相关推荐 */
						
					
					
					/* let playervideo = request(uri, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var $ = cheerio.load(body);
							let playeruri = $("#player #video source").attr("src");
							console.log("video地址"+playeruri);
							
							return links
						} else {
							res.send(errorRequest());
						}
					});	 */
					// links.push({
					//     uri
					// })
					return ret;
					// let player = $("#playleft iframe").find("#player").find("#video source").attr("src")
					// let playeruri = $("#player #video source").attr("src")
					
					// var links = [];
			
					/* if (items.length >= 1) {
						items.each((index,item)=>{
							let it = $(item)
							let doubanId = it.find('div').data('id')
			
							let title = it.find('img').attr('alt')
							let rate = Number(it.find('strong').text())
							let poster = it.find('img').attr('src')
			
							links.push({
								doubanId,
								title,
								rate,
								poster
							})
						});
					} */
					// return links
				});
				
				res.send(result);
				let endtime = new Date().getTime();
				console.log("请求耗时："+(endtime-starttime));
			} catch (e) {
				res.send(errorRequest());
			}
			finally{
				// 关闭浏览器
				brower.close();
			} 
		})();
	} catch (e) {
		res.send(errorRequest());
	}	
};

// 获取页面的真实地址
exports.animateGetRealUrl = function(req, res) {
	var result = {};
	var relurl = req.query.relurl || "";//动漫标识
	console.log(relurl);
	var videotypes = ['MP4','mp4','AVI','avi','MOV','mov','RMVB','rmvb','RM','rm','FLV','flv','3GP','3gp'];
	try {
		request(relurl, function(error, response, body) {
			// console.log("error"+error);
			// console.log("response:"+response.statusCode);
			// console.log("body:"+body);
			if (!error && (response.statusCode == 200 ||response.statusCode == 302)) {
				var $ = cheerio.load(body);
				if(!isnull($("#video"))){
					var playurl = $("#video").find("source").attr("src");
					var vflag = false;
					// console.log(videotypes.length);
					if(!isnull(playurl)){
						for (var i = 0; i < videotypes.length; i++) {
							if(playurl.indexOf(videotypes[i])!=-1){
								vflag = true;
								break;
							}
						}
						result.type = $("#video").find("source").attr("type");
						// console.log(vflag);
						if(vflag){
							result.playurl = playurl;
							res.send(result);
						}
						else{
							httprequest3(playurl).then(function(req) {
								if(req!=null&&req!=""&&req!=undefined&&req.indexOf("http")!=-1){
									req = req.substring(req.indexOf("http"),req.length);
									result.playurl = req;
								}
								res.send(result);
							})	
							/* request(playurl, function(error, response, body) {
								var $ = cheerio.load(body);
								console.log(body);
								res.send(body);
							}); */	
						}
					}
					else{
						res.send(errorRequest());
					}
				}
				else{
					res.send(errorRequest());
				}
			} else {
				res.send(errorRequest());
			}	
		});	
	} catch (e) {
		res.send(errorRequest());
	}
};	
/******************************bimi-api******************************************************/
//新增,推荐动漫
exports.addRecommend = function(req, res) {
	var result = [];
	request("http://www.bimibimi.tv/", function(error, response, body) {
		var $ = cheerio.load(body);
		var html = $(".tabcon01 .plist01");
		html.map(function(i, v) {
			var list = [];
			$(v).find("li").map(function(i, v) {
				list.push({
					update: $(v).find("span").text(),
					name: $(v).find("p").text(),
					url: $(v).find("a").attr("href"),
					img: $(v).find("img").attr("original")
				});
			});
			var tab = {};
			switch (i) {
				case 0:
					tab.title = "新增连载动漫";
					tab.url = "http://www.bimibimi.tv/list/7.html";
					break;
				case 1:
					tab.title = "新增完结动漫";
					tab.url = "http://www.bimibimi.tv/list/18.html";
					break;
				case 2:
					tab.title = "推荐连载动漫";
					tab.url = "http://www.bimibimi.tv/list/7.html";
					break;
				case 3:
					tab.title = "推荐完结动漫";
					tab.url = "http://www.bimibimi.tv/list/18.html";
					break;
			}
			result.push({
				tab: tab,
				list: list
			});
		});
		res.send(result);
	});
};

//最近更新
exports.recentUpdate = function(req, res) {
	var result = [];
	request("http://www.bimibimi.tv/list/29.html", function(error, response, body) {
		var $ = cheerio.load(body);
		var html = $(".box04");
		html.find("li").map(function(i, v) {
			var name = $(v).find("h3 a").text();
			var episode = /第[0-9]*集/g.exec(name)[0];
			result.push({
				time: $(v).find("em").text(),
				sort: $(v).find("i").text(),
				type: $(v).find("strong a").text(),
				name: name.replace(episode, ""),
				url: $(v).find("h3 a").attr("href"),
				episode: episode
			});
		});
		res.send(result);
	});
};

//热门新番
exports.hotNewAnimate = function(req, res) {
	var result = [];
	request("http://www.bimibimi.tv/", function(error, response, body) {
		var $ = cheerio.load(body);
		var tabHtml = $(".xinfan-nav li");
		tabHtml.map(function(i, v) {
			var tabObj = {
				tab: $(v).find("a").text(),
				child: []
			};
			$("#tabxinfan_" + (i + 1)).find("li").map(function(ii, vv) {
				var childObj = {
					tab: $(vv).find("a").text(),
					list: [],
					otherList: []
				};
				$("#tabxinfan_" + (i + 1) + "_tab_" + (ii + 1) + " .plist01").find("li").map(function(iii, vvv) {
					childObj.list.push({
						url: $(vvv).find("a").attr("href"),
						img: $(vvv).find("img").attr("original"),
						episode: $(vvv).find("span").text(),
						name: $(vvv).find("p").text()
					});
				});
				$("#tabxinfan_" + (i + 1) + "_tab_" + (ii + 1) + " .tlist01").find("li").map(function(iii, vvv) {
					childObj.otherList.push({
						url: $(vvv).find("a").attr("href"),
						name: $(vvv).find("a").text()
					});
				});
				tabObj.child.push(childObj);
			});
			result.push(tabObj);
		});
		res.send(result);
	});
};

//2016年7月新番排行榜/2016年4月新番排行榜/动漫总排行榜/动漫资讯
exports.ranking = function(req, res) {
	var result = [];
	request("http://www.bimibimi.tv/", function(error, response, body) {
		var $ = cheerio.load(body);
		var html = $(".toplists");
		html.find("dl").map(function(i, v) {
			var tab = "";
			if ($(v).find("dt a").length == 0) {
				tab = $(v).find("dt").text().replace(/\s/g, "");
			} else {
				tab = $(v).find("dt a").eq(1).text();
			}
			var tabObj = {
				tab: tab,
				url: $(v).find("dt a").eq(1).attr("href"),
				list: []
			};
			$(v).find("dd").map(function(ii, vv) {
				tabObj.list.push({
					name: $(vv).find("a").eq(0).text(),
					url: $(vv).find("a").eq(0).attr("href"),
					episode: $(vv).find("a").eq(1).find("em").text()
				});
			});
			result.push(tabObj);
		});
		res.send(result);
	});
};

//搜索
exports.search = function(req, res) {
	var pageSize = 25;
	var result = {
		page: 1,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	var k = req.query.k;
	if (k) {
		var page = req.query.page || 1;
		var url = "http://www.bimibimi.tv/search/index.php?k=" + encodeURIComponent(k) + "&page=" + page;
		request(url, function(error, response, body) {
			var $ = cheerio.load(body);
			var count = $(".bread span em").text() || "0";
			count = parseInt(count);
			if (count > 0) {
				var list = [];
				$(".plist02").find("li").map(function(i, v) {
					var other = $(v).find("div").text().replace(/\r|\n|\r\n|\s/g, "");
					list.push({
						url: $(v).find("a").attr("href"),
						name: $(v).find("a").find("p").text(),
						lastest: $(v).find("a").find("span").text(),
						img: $(v).find("a").find("img").attr("src"),
						download: /下载：[0-9]*类型：/g.exec(other)[0].replace("下载：", "").replace("类型：", ""),
						type: /类型：.*地区：/g.exec(other)[0].replace("类型：", "").replace("地区：", ""),
						local: /地区：.*$/g.exec(other)[0].replace("地区：", "")
					});
				});
				var totalPage = 0;
				if (count % pageSize == 0) {
					totalPage = count / pageSize;
				} else {
					totalPage = parseInt(count / pageSize) + 1;
				}
				result = {
					page: page,
					pageSize: pageSize,
					totalCount: count,
					totalPage: totalPage,
					list: list,
					lastPage: page == totalPage,
					firstPage: page == 1,
					ranking: []
				};
			}
			//动漫排行
			$("#tabph").find("li").map(function(i, v) {
				var rankObj = {
					tab: $(v).text(),
					list: []
				};
				$("#tabphcon_" + (i + 1)).find("li").map(function(ii, vv) {
					rankObj.list.push({
						name: $(vv).find("a").text(),
						url: $(vv).find("a").attr("href"),
						count: $(vv).find("span").text(),
						sort: $(vv).find("em").text()
					});
				});
				result.ranking.push(rankObj);
			});
			res.send(result);
		});
	} else {
		res.send({
			status: 201,
			description: "关键字不能为空"
		});
	}
};

//动漫详情
exports.detail = function(req, res) {
	var url = req.query.url;
	var result = {};
	if (url) {
		request(decodeURIComponent(url), function(error, response, body) {
			var $ = cheerio.load(body, {
				decodeEntities: false
			});
			result.name = $(".infotitle").find("h1").text();
			result.img = $(".bpic").find("img").attr("src");
			result.intro = $(".jianjie").html();
			result.opts = [];
			$(".info li").map(function(i, v) {
				result.opts.push({
					key: $(v).find("span").text(),
					value: $(v).find("p").text().replace(/\s/g, "")
				});
			});
			result.download = [];
			$("#tabxinfan_1 li").map(function(i, v) {
				var dlObj = {};
				dlObj.tab = $(v).text().replace(/\s/g, "");
				dlObj.list = [];
				$("#tabxinfan_1_tab_" + (i + 1)).find("li").map(function(ii, vv) {
					dlObj.list.push({
						name: $(vv).find("a").text(),
						url: $(vv).find("a").attr("href")
					});
				});
				result.download.push(dlObj);
			});
			result.recommend = [];
			result.editRecommend = [];
			$(".c_ph").eq(0).find("li").map(function(i, v) {
				var obj = {
					sort: $(v).find("em").text(),
					count: $(v).find("span").text(),
					name: $(v).find("a").text(),
					url: $(v).find("a").attr("href")
				};
				if ($(".phItem").eq(0).find("h2").text() == "相关推荐") {
					result.recommend.push(obj);
				} else if ($(".phItem").eq(0).find("h2").text() == "编辑推荐") {
					result.editRecommend.push(obj);
				}
			});
			$(".c_ph").eq(1).find("li").map(function(i, v) {
				var obj = {
					sort: $(v).find("em").text(),
					count: $(v).find("span").text(),
					name: $(v).find("a").text(),
					url: $(v).find("a").attr("href")
				};
				if ($(".phItem").eq(1).find("h2").text() == "相关推荐") {
					result.recommend.push(obj);
				} else if ($(".phItem").eq(1).find("h2").text() == "编辑推荐") {
					result.editRecommend.push(obj);
				}
			});
			res.send(result);
		});
	} else {
		res.send({
			status: 201,
			description: "参数不正确"
		});
	}
};

//列表
exports.list = function(req, res) {
	var ver = req.query.ver || "";
	var letter = req.query.letter || ""; //A-Z 100
	var sort = req.query.sort || ""; //""最新更新 1热门播放
	var page = req.query.page || 1;
	var tab = req.query.tab || 7; //连载动漫  18:完结动漫
	var url = "http://www.bimibimi.tv/list/s__$ver_$tab____$letter_$sort_$page.html";
	var pageSize = 20;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	url = url.replace("$ver", ver).replace("$tab", tab).replace("$letter", letter).replace("$sort", sort).replace("$page",
		page);
	console.log(url);
	request(url, function(error, response, body) {
		var $ = cheerio.load(body);
		var count;
		if ($(".pages").find("a").length > 0) {
			count = $(".pages").eq(0).find("a").eq(0).text().replace("条", "");
		} else {
			count = $(".plist02 li").length;
		}
		count = parseInt(count);
		var totalPage = 0;
		if (count % pageSize == 0) {
			totalPage = count / pageSize;
		} else {
			totalPage = parseInt(count / pageSize) + 1;
		}
		result.totalCount = count;
		result.totalPage = totalPage;
		result.lastPage = page == totalPage;
		result.firstPage = page == 1;
		if (count > 0) {
			$(".plist02 li").map(function(i, v) {
				result.list.push({
					url: $(v).find("a").attr("href"),
					img: $(v).find("img").attr("src"),
					name: $(v).find("p").text(),
					updateTime: $(v).find("em").eq(0).text(),
					downloadCount: $(v).find("em").eq(1).text().replace("下载次数：", "").replace(/\s/g, ""),
					episode: $(v).find("span").text()
				});
			});
		}
		//动漫排行
		$("#tabph").find("li").map(function(i, v) {
			var rankObj = {
				tab: $(v).text(),
				list: []
			};
			$("#tabphcon_" + (i + 1)).find("li").map(function(ii, vv) {
				rankObj.list.push({
					name: $(vv).find("a").text(),
					url: $(vv).find("a").attr("href"),
					count: $(vv).find("span").text(),
					sort: $(vv).find("em").text()
				});
			});
			result.ranking.push(rankObj);
		});
		res.send(result);
	});
};

//新闻列表
exports.news = function(req, res) {
	var page = req.query.page || 1;
	var url = "http://www.bimibimi.tv/list/26.html";
	var pageSize = 15;
	page = parseInt(page);
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true,
		ranking: []
	};
	if (page > 1) {
		url = url.replace(".html", "_" + page + ".html");
	}
	request({
		url: url,
		encoding: null
	}, function(error, response, body) {
		body = Iconv.decode(body, 'gb2312').toString();
		var $ = cheerio.load(body);
		var count = $(".bread span em").text() || "0";
		count = parseInt(count);
		var totalPage = 0;
		if (count % pageSize == 0) {
			totalPage = count / pageSize;
		} else {
			totalPage = parseInt(count / pageSize) + 1;
		}
		result.totalCount = count;
		result.totalPage = totalPage;
		result.lastPage = page == totalPage;
		result.firstPage = page == 1;
		if (count > 0) {
			$(".subNewsList li").map(function(i, v) {
				result.list.push({
					url: $(v).find("a").eq(0).attr("href"),
					img: $(v).find("img").attr("src"),
					title: $(v).find("a").eq(1).text(),
					description: $(v).find("span").text(),
					time: $(v).find("em").text()
				});
			});
		}
		res.send(result);
	});
};

//新闻详情
exports.newsDetail = function(req, res) {
	var url = req.query.url;
	if (url) {
		var result = {};
		request(decodeURIComponent(url), function(error, response, body) {
			var $ = cheerio.load(body, {
				decodeEntities: false
			});
			if ($(".articleTitle")) {
				result.title = $(".articleTitle h1").text();
				var subtitle = $(".articleTitle span").text();
				result.time = /时间：.*点击/.exec(subtitle)[0].replace("时间：", "").replace("点击", "");
				result.content = $(".articleContent").html();
			}
			res.send(result);
		});
	} else {
		res.send({
			status: 201,
			description: "参数不正确"
		});
	}
};

//专题
exports.topics = function(req, res) {
	var result = [];
	var url = "http://www.bimibimi.tv/list/27.html";
	request(url, function(error, response, body) {
		var $ = cheerio.load(body);
		$(".ztlist li").map(function(i, v) {
			result.push({
				url: $(v).find("a").eq(0).attr("href"),
				img: $(v).find("img").attr("src"),
				title: $(v).find("a").eq(1).text()
			});
		});
		res.send(result);
	});
};

//专题详情
exports.topicDetail = function(req, res) {
	var page = req.query.page || 1;
	var pageSize = 21;
	var result = {
		page: page,
		pageSize: pageSize,
		totalCount: 0,
		totalPage: 1,
		list: [],
		lastPage: true,
		firstPage: true
	};
	var url = req.query.url;
	if (url) {
		url = decodeURIComponent(url);
		if (page > 1) {
			url = url.replace(".html", "-" + page + ".html");
		}
		request(url, function(error, response, body) {
			var $ = cheerio.load(body);
			var count = $(".pages").find("a").eq(0).text().replace("条", "") || "0";
			count = parseInt(count);
			if (count > 0) {
				var totalPage = 0;
				if (count % pageSize == 0) {
					totalPage = count / pageSize;
				} else {
					totalPage = parseInt(count / pageSize) + 1;
				}
				result.totalCount = count;
				result.totalPage = totalPage;
				result.lastPage = page == totalPage;
				result.firstPage = page == 1;
				$(".plist02").find("li").map(function(i, v) {
					var other = $(v).find("div").text().replace(/\r|\n|\r\n|\s/g, "");
					result.list.push({
						url: $(v).find("a").attr("href"),
						name: $(v).find("a").find("p").text(),
						lastest: $(v).find("a").find("span").text(),
						img: $(v).find("a").find("img").attr("src"),
						download: /播放：.*类型：/g.exec(other)[0].replace("播放：", "").replace("类型：", ""),
						type: /类型：.*地区：/g.exec(other)[0].replace("类型：", "").replace("地区：", ""),
						local: /地区：.*$/g.exec(other)[0].replace("地区：", "")
					});
				});
			}
			res.send(result);
		});
	} else {
		res.send({
			status: 201,
			description: "参数不正确"
		});
	}
};

function errorRequest() {
	var ret = {};
	ret.restate = "-1";
	ret.data = "";
	ret.redes = "数据获取异常!";
	return ret;
}

function getRealURL(url) {
	if(url.indexOf('.html') > -1){
		return "https://v.nmbaojie.com/mingri/mingri.php?url="+ url;
	}
	else if(url.indexOf('.mp4') > -1){
		return "https://play.2xuexi.top/static/danmu/dm.php?"+ url;
	}
	else if(url.indexOf('.m3u8') > -1){
		return "https://www.629055.com/m3u8.php?url="+ url;
	}
	else{
		return "https://play.2xuexi.top/static/danmu/dm.php?"+ url;
	}
}

function httprequest(wyuri) {
	return new Promise((resolve, reject) => {
		var url = wyuri;
		var option = {
			url: url,
			method: "GET",
			headers: {
				"content-type": "application/*",
			},
		}
		request(option, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				resolve($(".list_module_img li").length);
			}
		});
	});

};

function httprequest2(wyuri) {
	return new Promise((resolve, reject) => {
		var url = wyuri;
		var option = {
			url: url,
			method: "GET",
			headers: {
				"content-type": "application/*",
			},
		}
		request(option, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				resolve($(".drama-module li").length);
			}
		});
	});

};

function httprequest3(reurl) {
	return new Promise((resolve, reject) => {
		try {
			var host = reurl.substring(reurl.indexOf("//")+2,find(reurl,"/",2));
			console.log(host);
			var url = reurl;
			var option={
				hostname:host,
				path:url,
				headers:{
				  'Accept':'*/*',
				  'Accept-Encoding':'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
				  'Accept-Language':'zh-CN,zh;q=0.8',
				  'Connection':'keep-alive',
				  'Host':host,
				  
				}
			};
			https.get(option,function(res){
			  var chunks = [];
			  res.on('data',function(chunk){
			    chunks.push(chunk);
			  })
			  res.on('end',function(){
			    console.log(Buffer.concat(chunks).toString());
				resolve(Buffer.concat(chunks).toString());
			  }) 
			})
		} catch (e) {
			 console.log(e);
		}	
	});
};
function find(str,cha,num){
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}

function isnull(str){
    if(str==null||str==""||str==undefined){
		return true;
	}
	return false;
}

function init(){
    (async () => {
        for(var i=0;i<MAX_WSE;i++){
            const browser = await puppeteer.launch({headless:true,
                args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ]});
            browserWSEndpoint = await browser.wsEndpoint();
            WSE_LIST[i] = browserWSEndpoint;
        }
        console.log(WSE_LIST);
    })(); 
}
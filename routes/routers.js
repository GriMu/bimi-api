var Index = require("./index");
var Api = require("./api");

module.exports = function (app) {

  app.get("/", Index.index);
  app.get("/resource", Index.resource);

  app.get("/bimianimate/carousel", Api.carousel);
  app.get("/bimianimate/weekUpdate", Api.weekUpdate);
  
  /* app.get("/addRecommend", Api.addRecommend);
  app.get("/recentUpdate", Api.recentUpdate);
  app.get("/hotNewAnimate", Api.hotNewAnimate);
  app.get("/ranking", Api.ranking);
  app.get("/search", Api.search);
  app.get("/detail", Api.detail);
  app.get("/list", Api.list);
  app.get("/news", Api.news);
  app.get("/newsDetail", Api.newsDetail);
  app.get("/topics", Api.topics);
  app.get("/topicDetail", Api.topicDetail);*/
  app.get("/bimianimate/todayHot", Api.todayHot);
  app.get("/bimianimate/sliderRecom", Api.sliderRecom);
  app.get("/bimianimate/monthRank", Api.monthRank);
  app.get("/bimianimate/newAnimate", Api.newAnimate); 
  
  app.get("/bimianimate/chinaAnimate", Api.chinaAnimate);
  app.get("/bimianimate/animatePlan", Api.animatePlan);
  app.get("/bimianimate/animateMovie", Api.animateMovie);
  app.get("/bimianimate/Movies", Api.Movies);
  app.get("/bimianimate/yearAnimateList", Api.yearAnimateList);
  app.get("/bimianimate/guoManAnimateList", Api.guoManAnimateList);
  app.get("/bimianimate/fanZuAnimateList", Api.fanZuAnimateList);
  app.get("/bimianimate/juChangAnimateList", Api.juChangAnimateList);
  app.get("/bimianimate/moveAnimateList", Api.moveAnimateList);
  app.get("/bimianimate/zixun", Api.zixun);
  app.get("/bimianimate/artDetail", Api.artDetail);
  app.get("/bimianimate/animateDetail", Api.animateDetail);
  app.get("/bimianimate/animatePlay", Api.animatePlay);
  app.get("/bimianimate/latestShowAnimate", Api.latestShowAnimate);
  app.get("/bimianimate/animateRank", Api.animateRank);
  app.get("/bimianimate/searchByKeyWord", Api.searchByKeyWord);
  app.get("/bimianimate/animatePlayByPT", Api.animatePlayByPT);
  app.get("/bimianimate/animateGetRealUrl", Api.animateGetRealUrl);
};

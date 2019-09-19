var Index = require("./index");
var Api = require("./api");

module.exports = function (app) {

  app.get("/", Index.index);
  app.get("/resource", Index.resource);

  app.get("/carousel", Api.carousel);
  app.get("/weekUpdate", Api.weekUpdate);
  
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
  app.get("/topicDetail", Api.topicDetail);
  app.get("/todayHot", Api.todayHot);
  app.get("/sliderRecom", Api.sliderRecom);
  app.get("/monthRank", Api.monthRank);
  app.get("/newAnimate", Api.newAnimate); */
  
  app.get("/chinaAnimate", Api.chinaAnimate);
  app.get("/animatePlan", Api.animatePlan);
  app.get("/animateMovie", Api.animateMovie);
  app.get("/Movies", Api.Movies);
  app.get("/yearAnimateList", Api.yearAnimateList);
  app.get("/guoManAnimateList", Api.guoManAnimateList);
  app.get("/fanZuAnimateList", Api.fanZuAnimateList);
  app.get("/juChangAnimateList", Api.juChangAnimateList);
  app.get("/moveAnimateList", Api.moveAnimateList);
  app.get("/zixun", Api.zixun);
  app.get("/artDetail", Api.artDetail);
  app.get("/animateDetail", Api.animateDetail);
  app.get("/animatePlay", Api.animatePlay);
  
};

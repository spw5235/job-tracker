'use strict';

// const store = require('../store');
const displayNewJobDash = require('../templates/dashboard/new-job-home.handlebars');
const displayDashboardHome = require('../templates/dashboard/dashboard-home.handlebars')
const dashboardUi = require('./ui');
// const displayJobCreateForm = require('../templates/job/new-job-form.handlebars');

const onShowCreateDash = function(event) {
  event.preventDefault();
  $(".content").children().remove();
  let showCreateDashHome = displayNewJobDash();
  $('.content').append(showCreateDashHome);
};

const onAdjustActiveNav = function(event) {
  event.preventDefault();
  //reset classes
  $('.homepage-category').removeClass("active");
  $('.nav-tab-btn').removeClass("target-nav");


  $(this).addClass("active");
  $(this).children(".nav-tab-btn").addClass("target-nav");
  // $(this).children("a").addClass("btn-info");
  // let thisDiv = $(this).attr("id");

};
//
// const onExistingCompany = function(event) {
//   event.preventDefault();
//   companiesApi.getCompanies()
//     .done(dashboardUi.getExistingSuccess)
//     .fail(dashboardUi.getExistingFailure);
// };
//
// const onCreateFromExisting = function(event) {
//   event.preventDefault();
//   store.currentCompanyId = $(this).attr("data-current-company-id");
//   $(".content").children().remove();
//   let showCreateForm = displayJobCreateForm();
//   $('.content').append(showCreateForm);
//   $(".current").attr("data-current-job-id", store.currentJobId);
//   $(".current").attr("data-current-company-id", store.currentCompanyId);
// };

const onShowDashboard = function() {
  $('.content').children().remove();
  let showDashboardHome = displayDashboardHome();
  $('.content').append(showDashboardHome);
};

const addHandlers = () => {
  // $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash)
  $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash);
  // $('.content').on('click', '#new-job-existing-company', onExistingCompany);
  $('.content').on('click', '#dashboard-home-btn', onShowDashboard);
  $('#dashboard-home-btn').on('click', onShowDashboard);
  $(".nav-main-container ul li").on('click', onAdjustActiveNav);
  // $('.content').on('click', '.dashboard-existing-create-btn', onCreateFromExisting);
};

module.exports = {
  addHandlers,
};

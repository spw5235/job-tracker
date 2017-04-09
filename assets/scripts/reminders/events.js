'use strict';
const remindersApi = require('./api');
const remindersUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Reminder EVENTS

const onGetReminders = function(event) {
  event.preventDefault();
  remindersApi.getReminders()
    .done(remindersUi.getReminderSuccess)
    .fail(remindersUi.getReminderFailure);
};

const onShowReminderRecord = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  remindersApi.showReminder()
    .done(remindersUi.showReminderRecordSuccess)
    .fail(remindersUi.showReminderRecordFailure);
};

const onDeleteReminder = function(event) {
  event.preventDefault();
  store.currentReminderId= $(this).attr("data-current-reminder-id");
  remindersApi.deleteReminder(store.currentReminderId)
    .done(remindersUi.deleteReminderSuccess)
    .fail(remindersUi.deleteReminderFailure);
};

const onCreateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createReminderData = data;
  store.lastShowReminderData = data;

  // Contact Category

  let contactCategory = "contact-category";

  let contactCategoryId = $("#select-option-contact-category").val();

  if ( contactCategoryId === undefined ) {
    data.reminder.contact_ref_id = 0;
  } else {
    data.reminder.contact_ref_id = parseInt(contactCategoryId);
  }

  data.reminder.contact_name = dashboardLogic.determineTagText(contactCategory, contactCategoryId);

  // Job Category
  let jobCategory = "job-category";

  let jobCategoryId = $("#select-option-job-category").val();

  if ( jobCategoryId === undefined ) {
    data.reminder.job_ref_id = 0;
  } else {
    data.reminder.job_ref_id = parseInt(jobCategoryId);
  }

  data.reminder.job_name = dashboardLogic.determineTagText(jobCategory, jobCategoryId);

  // Reminder Type:

  data.reminder.reminder_type = $("#reminder-type-select").val();

  // Submit Values

  remindersApi.createReminder(data)
    .done(remindersUi.createReminderSuccess)
    .fail(remindersUi.createReminderFailure);
};

const onEditReminder = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  remindersUi.updateFormGenerator();

  let categoryContact = "contact-category";

  dashboardLogic.tagCheckboxUpdate(categoryContact);

  let defaultVal = $("#reminder-type-select").attr("data-default-value");
  let divId = "#reminder-type-select";

  dashboardLogic.preselectDefault(divId, defaultVal);

  let jobId = parseInt($("#insert-tag-job-category").attr("data-update-id"));
  let jobName = $("#insert-tag-job-category").attr("data-update-name");
  if (jobId > 0) {
    $("#job-tag-desc").text("The current job associated with the reminder is: ");
    $("#insert-tag-job-category").text(jobName);
  }

};

const onUpdateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  let category = "contact-category";
  let categoryId = $(".select-option-value").val();

  if ( categoryId === undefined ) {
    data.reminder.contact_ref_id = 0;
  } else {
    data.reminder.contact_ref_id = categoryId;
  }

  data.reminder.reminder_type = $("#reminder-type-select").val();

  data.reminder.contact_name = dashboardLogic.determineTagText(category, categoryId);

  remindersApi.updateReminder(data)
    .done(remindersUi.updateReminderSuccess)
    .fail(remindersUi.updateReminderFailure);
};

const onShowReminderCreateForm = function(event) {
  event.preventDefault();
  remindersUi.showReminderCreateForm();
};

const onSelectReminderDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const onDisplayReminderDropdown = function(event) {
  event.preventDefault();
  let thisCheckBoxStatus = $(this).is(':checked');

  if (!thisCheckBoxStatus) {
    $(this).parent().children(".tag-select-container").remove();
  } else {

  }

  let isUpdateForm;
  let checkboxDivId = $(this).attr("id");
  let tagCategory = $(this).attr("class");
  let updateFormStatus = $(".general-form-container").attr("data-update-form");
  updateFormStatus = parseInt(updateFormStatus);
  if (updateFormStatus === 1) {
    isUpdateForm = true;
  } else {
    isUpdateForm = false;
  }
  dashboardLogic.tagCheckboxClicked(tagCategory, checkboxDivId);
};

const addHandlers = () => {
  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  $('.content').on('submit', '#update-reminder-form', onUpdateReminder);
  $('.content').on('click', '#reminder-record-btn-edit', onEditReminder);
  $('.content').on('click', '#generate-create-reminder-btn', onShowReminderCreateForm);
  $('.content').on('click', '.view-reminder-record-btn', onShowReminderRecord);
  $('.content').on('click', '#get-reminders-btn', onGetReminders);
  $('.content').on('click', '#reminder-record-delete', onDeleteReminder);
  $('.content').on('change', '#tag-contact-to-reminder', onDisplayReminderDropdown);
  $('.content').on('change', '#tag-job-to-reminder', onDisplayReminderDropdown);
  $('.content').on('change', '#select-option-contact-category', onSelectReminderDropdown);
  $('.content').on('change', '#select-option-job-category', onSelectReminderDropdown);
};

module.exports = {
  addHandlers,
};

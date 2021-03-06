'use strict';

const store = require('../store');
const displayEditDocument = require('../templates/document/update-document-form.handlebars');
const displayDocumentDashboard = require('../templates/document/get-documents.handlebars');
const displayDocumentDetails = require('../templates/document/show-document-record.handlebars');
const displayDocumentCreateForm = require('../templates/document/create-document.handlebars');
const documentsApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayDocumentOptions = require('../templates/document/option-dropdown-documents.handlebars');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');

const getDocumentSuccess = (data) => {
  store.documentDataForEdit = data;
  $(".notification-container").children().text("");

  $(".content").children().remove();

  let dataArr = data.documents;

  for (let i = 0; i < dataArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayOptOne = (dataArr[i].docdate);
    let currArrayOptTwo = (dataArr[i].docsubject);
    let currArrayOptThree = (dataArr[i].docurl);

    if (currArrayOptOne === "" || currArrayOptOne === null) {
      dataArr[i].docdate = unavailable;
    }
    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
      dataArr[i].docsubject = unavailable;
    }
    if (currArrayOptThree === "" || currArrayOptThree === null) {
      dataArr[i].docurl = unavailable;
    }
  }

  let documentDashboard = displayDocumentDashboard({
    documents: data.documents
  });

  $('.content').append(documentDashboard);

  let allDocumentsEmptyLength = $(".document-summary-table tbody").children().length;

  if (allDocumentsEmptyLength === 0) {
    $(".document-summary-table").remove();
    $(".all-documents-empty").text('There are no documents associated with your account. Click "Create Document" to get started.');
  }
  logic.dateFormatByClass();
};

const showDocumentRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowDocumentData = data;

  console.log(data.document.doctext);

  let documentDetails = displayDocumentDetails({
    document: data.document
  });
  $('.content').append(documentDetails);
  logic.displayUrl();
  logic.dateFormatByClass();
  $(".doc-text-insert").text(data.document.doctext);
};

const showDocumentRecordFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be displayed.");
};

const showDocumentCreateForm = () => {
  let listCategory = "job";
  let formCategory = "document";


  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateDocumentForm = displayDocumentCreateForm();
  $('.content').append(showCreateDocumentForm);

  let radioTemplate = displayRadioButtonsTemplate();
  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

  linkLogic.radioClassIdNameGen(formCategory, listCategory);
  $("#job-category-radio-container").hide();
  let defaultDate = logic.defaultDate();
  $(".default-date").val(defaultDate);
};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowDocumentData;

  let editDocument = displayEditDocument({
    document: data.document
  });
  $('.content').append(editDocument);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let listRefId = parseInt(store.currentJobRefId);


  if (listRefId > 0) {
    $(listLinkStatusSelector).text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

  if ( updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();
    $(".update-radio-container-btn").hide();
  }

  let currentRefTextValTxt = "." + listCategory + "-update-radio-text";

  if (store.currentJobRefText === "") {
    $(currentRefTextValTxt).text("N/A");
  }

  let preselectVal = store.currentDocumentType;
  let preselectDiv = "#document-type-select";
  linkLogic.preselectDefault(preselectDiv, preselectVal);

  let divId = "#doctext-field";
  logic.textAreaHeightUpdate(divId);
};

const getDocumentFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
};

const createDocumentSuccess = (data) => {
  store.currentDocumentId = data.document.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully created.");

  let showDocumentDetails = displayDocumentDetails({
    document: store.createDocumentData.document
  });
  $(".content").append(showDocumentDetails);
  $(".current").attr("data-current-document-id", store.currentDocumentId);
  logic.displayUrl();
  logic.dateFormatByClass();
};

const deleteDocumentSuccess = () => {
  $(".notification-container").children().text("");
  $(".success-alert").text("The record has been successfully deleted");
  logic.dateFormatByClass();
  documentsApi.getDocuments()
    .done(getDocumentSuccess)
    .fail(getDocumentFailure);
};

const deleteDocumentFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be deleted.");
};

const updateDocumentSuccess = (data) => {
  store.currentDocumentId = data.document.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully updated.");

  let showDocumentDetails = displayDocumentDetails({
    document: data.document
  });
  $(".content").append(showDocumentDetails);
  $(".current").attr("data-current-document-id", store.currentDocumentId);
  logic.displayUrl();
  logic.dateFormatByClass();
};

const displayDocumentDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayDocumentOptions({
    documents: data.documents
  });

  let dataUpdateFormVal = parseInt($("#update-document-form").attr("data-update-form"));

  $('.associate-reminder-with-document-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentDocumentId = store.currentDocumentId;
    let valueString = '#select-option-document-name option[value=' + currentDocumentId + ']';
    $(valueString).prop('selected', true);
  }
};

const createDocumentFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
};

const updateDocumentFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
};

module.exports = {
  getDocumentSuccess,
  showDocumentRecordSuccess,
  deleteDocumentSuccess,
  deleteDocumentFailure,
  showDocumentCreateForm,
  getDocumentFailure,
  updateDocumentSuccess,
  showDocumentRecordFailure,
  createDocumentSuccess,
  displayDocumentDropdownSuccess,
  displayDocumentOptions,
  generateUpdateForm,
  createDocumentFailure,
  updateDocumentFailure,
};

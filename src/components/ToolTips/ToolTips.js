import 'popper.js';
import $ from 'jquery';
import 'bootstrap';

$(function(){
  console.log("Tooltips Started...")
  $('[data-toggle="tooltip"]').tooltip()
})
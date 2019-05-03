import $ from "jquery";

export default {
  http(param) {
    $.ajax({
      type: param.type,
      url: "http://www.gequdaquan.net/gqss/api.php?",
      data: param.data,
      dataType: "jsonp",
      success: function(response) {
        return response
      }
    });
  }
};

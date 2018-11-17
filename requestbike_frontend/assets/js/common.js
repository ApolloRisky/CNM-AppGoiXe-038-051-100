function setStatusByReqId(tableId, idReq, status) {
    const tableId_string = '#' + tableId;
    const reqId_string = '#' + idReq;
    $(tableId_string + ' tr').each(function () {
        const reqId = $(reqId_string).val();
        const reqId_table = $(this).find("td:first").html();
        const reqObject = {
            reqId,
            status
        };
        if (reqId_table === reqId) {
            // Đầu tiên, cập nhật status của nó dưới db
            $.ajax({
                url: "http://localhost:3000/request/status",
                type: "PATCH",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(reqObject),
                dataType: "json",
            }).done(function (data) {
                // sau khi cập nhật thành công thì reload lại table (query db để ghi đè lên lại)
                // App#2 cũng phải tự realtime vs chính nó (nhiều app#2)
                $.ajax({
                    url: "http://localhost:3000/requests/unidentified+identified",
                    type: "GET",
                    dataType: "json"
                }).done(function (data) {
                    var source = document.getElementById("request-template").innerHTML;
                    var template = Handlebars.compile(source);
                    var html = template(data);
                    $("#requests").html(html);
                    // đồng thời emit cho app#3 biết, để cùng realtime
                    socket.emit("2_to_3_reload-table");
                });
            });
            return true;
        }
    });
}

function validateString(data) {
    if (data === undefined || data === '') {
        return false;
    }
    return true;
}

function resetInput() {
    $('#reqId').val("");
    $('#addr').val("");
    $('#note').val("")
    $('#status').val("");
    $('#lat').val("");
    $('#lng').val("");
}
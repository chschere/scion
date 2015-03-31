
function initServerStatus() {
    $('td.status').html('<b>...</b>');
}

function updateServerStatus(detailUrl) {
    $.ajax({
        url: detailUrl,
        dataType: "json"
    }).done(function(data) {
        var componentData = data['data'];
        if (!componentData)
            return;
        for (var i = 0; i < componentData.length; i++) {
            var info = componentData[i];
            var name = info['name'];
            var status = info['statename'];
            var $tdStatus = $('#' + name + '> .status');
            if ($tdStatus.text() != status) {
                $tdStatus.text(status);
                $tdStatus.fadeTo(0, 0);
                $tdStatus.fadeTo(200, 1);
            }
        }
    }).fail(function(a1, a2, a3) {
        // alert(a1 + a2 + a3);
    });
}

function initTopologyCheck() {
    $('#topology-info').hide();
}

function compareAdTopology(compareUrl) {
    var $alertDiv = $('#topology-info');
    $alertDiv.hide();
    $alertDiv.removeClass('alert-success alert-danger alert-warning');

    function alertNoTopology() {
        $alertDiv.addClass('alert-warning');
        $alertDiv.text('Cannot get topology');
    }

    function alertOk() {
        $alertDiv.addClass('alert-success');
        $alertDiv.text('Everything is OK');
    }

    function alertChanged(changes) {
        $alertDiv.addClass('alert-danger');
        $alertDiv.html('Stored topology is inconsistent with the remote one<br/>');
        var $changesList = $('<ul/>').attr('id', 'changes-list');
        $.each(changes, function(index, value) {
            $('<li>' + value + '</li>').appendTo($changesList);
        });
        $alertDiv.append($changesList);
    }

    $.ajax({
        url: compareUrl,
        dataType: "json"
    }).done(function(data) {
        if (data['status'] == 'OK') {
            alertOk();
        } else if (data['status'] == 'CHANGED') {
            alertChanged(data['changes']);
        } else {
            alertNoTopology();
        }
    }).fail(function(a1, a2, a3) {
        alertNoTopology();
    }).always(function() {
        $alertDiv.show(500);
    });
}

function initSendUpdates() {
}

function sendAdUpdates(sendUrl) {
}

$(document).ready(function() {
    initServerStatus();
    updateServerStatus(adDetailUrl);
    $("#update-ad-btn").click(function() {
        updateServerStatus(adDetailUrl);
    });
    // setInterval(updateServerStatus, 5000); // repeat every 5 seconds

    initTopologyCheck();
    compareAdTopology(adCompareUrl);
    $('#compare-topology-btn').click(function() {
        compareAdTopology(adCompareUrl);
    });

    initSendUpdates();
    $('#send-updates-btn').click(function() {
        sendAdUpdates(adSendUpdatesUrl);
    });

    // "Are you sure?" confirmation boxes
    $('.click-confirm').click(function(e) {
        return confirm('Are you sure?')
    })
});
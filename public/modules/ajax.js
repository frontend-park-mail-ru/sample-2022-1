(function () {
    const AJAX_METHODS = {
        GET: 'get',
        POST: 'post'
    };

    const noop = () => {};

    class Ajax {
        get({url, callback}) {
            return this._ajax({
                url,
                callback,
            });
        }

        post({url, callback, body}) {
            return this._ajax({
                url,
                callback,
                body,
                method: AJAX_METHODS.POST
            })
        }

        _ajax({
            url = '/',
            method = AJAX_METHODS.GET,
            body = null,
            callback = noop
        }) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState !== XMLHttpRequest.DONE) return;

                callback(xhr.status, xhr.responseText);
            });

            if (body) {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
                xhr.send(JSON.stringify(body));
                return;
            }

            xhr.send();
        }
    }

    window.Ajax = new Ajax();
})();

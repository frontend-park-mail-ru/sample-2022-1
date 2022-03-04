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

        promisifyGet(params = {}) {
            return new Promise((resolve, reject) => {
                this._ajax({
                    ...params,
                    method: AJAX_METHODS.GET,
                    callback: (status, responseText) => {
                        // 1xx, 2xx
                        if (status < 300) {
                            resolve({
                                status,
                                responseText
                            });
                            return;
                        }

                        reject({
                            status,
                            responseText
                        })
                    }
                })
            })
        }

        getUsingFetch(params = {}) {
            let status;

            return fetch(params.url, {
                method: AJAX_METHODS.GET
            })
            .then((response) => {
                status = response.status;
                return response.json()
            })
            .then(parsedBody => {
                return {
                    status,
                    responseText: parsedBody
                }
            });
        }

        async asyncGetUsingFetch(params = {}) {
            
            const response = await fetch(params.url, {
                method: AJAX_METHODS.GET
            });

            try {
                const parsedBody = await response.json();
            } catch (err) {
                alert('я не смогу превратить ответ в json')
            }
            

            return {
                status: response.status,
                responseText: parsedBody
            };
        }
    }

    window.Ajax = new Ajax();
})();

import axios from 'axios';
import router from '../router';

axios.defaults.timeout = 300000;
export default {
    get(url, data, okFn) {
        // 设置jwtToken
        axios.defaults.headers.common['jwtToken'] = sessionStorage.getItem('token') || '';
        axios.get(url, {
            "params": data
        })
        .then((response) => {
            if (response.data.error_code == 200) {
                okFn && okFn(response.data);
            } else if (response.data.error_code == 403) {
                router.push({path: "/login"});
            } else {
                if (response.data.error_msg) {
                    alert(response.data.error_msg);
                }
            }
        })
        .catch((response) => {
            if (response.error_msg) {
                alert(response.error_msg);
            }
        });
    },
    post(url, data, okFn, failFn, errorFn) {
        // 设置jwtToken
        axios.defaults.headers.common['jwtToken'] = sessionStorage.getItem('token') || '';
        axios.post(url, data).then((response) => {
            if (response.data.error_code == 200) {
                okFn && okFn(response.data);
            }
            else if (response.data.error_code == 403) {
                router.push({path: "/login"});
            }
            else {
                failFn && failFn(response.data);
            }
        })
        .catch((error) => {
            errorFn ? errorFn(error) : alert(error);
        });
    },
    put(url, data, okFn) {
        // 设置jwtToken
        axios.defaults.headers.common['jwtToken'] = sessionStorage.getItem('token') || '';
        axios.put(url, data).then((response) => {
            if (response.data.error_code == 200) {
                okFn && okFn(response.data);
            } else if (response.data.error_code == 403) {
                router.push({path: "/login"});
            } else {
                if (response.data.error_msg) {
                    alert(response.data.error_msg);
                }
            }
        })
            .catch((response) => {
                if (response.error_msg) {
                    alert(response.error_msg);
                }
            });
    },
    delete(url, data, okFn) {
        // 设置jwtToken
        axios.defaults.headers.common['jwtToken'] = sessionStorage.getItem('token') || '';
        axios.delete(url, {
            "params": data
        })
            .then((response) => {
                if (response.data.error_code == 200) {
                    okFn && okFn(response.data);
                } else if (response.data.error_code == 403) {
                    router.push({path: "/login"});
                } else {
                    if (response.data.error_msg) {
                        alert(response.data.error_msg);
                    }
                }
            })
            .catch((response) => {
                if (response.error_msg) {
                    alert(response.error_msg);
                }
            });
    }
}

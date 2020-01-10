import { AsyncStorage } from 'react-native';
export default class Api {
    /*
        if (!isset($_POST["command"]) && file_get_contents('php://input') != "") {
         $_POST = json_decode(file_get_contents('php://input'), true);`
        }
         required to read JSON INPUT! POST variables are not automatically created; must be manually created
    */
    //static defServerUrl = "http://192.168.1.8/storeboss/SERVER/";
    // static defServerUrl = "https://orpheushq.com/storeboss/SERVER/";
    static defServerUrl = "https://orpheus.digital/storeboss/SERVER/";
    // static defServerUrl = "https://akunahq.com/storeboss/SERVER/";
    //static defServerUrl = "http://192.168.1.106/storeboss/SERVER/";
    //static defServerUrl = "http://192.168.43.152/storeboss/SERVER/";
    // static defServerUrl = "http://192.168.137.1/storeboss/SERVER/"; first 
    //static defServerUrl = "http://192.168.137.203/storeboss/SERVER/";
    //static defServerUrl = "http://192.168.0.146/storeboss/SERVER/";d

    static serverUrl = this.defServerUrl;
    static userInfo;
    static branchList = [];
    static downloadList = [
        "HR Docs",
        "Reports",
        "Promotions",
        "Schedules",
        "Announcements"
    ];
    static positionsList = [
        "Employee",
        "Front End Manager",
        "Asset Protection Manager",
        "Replenishment Manager",
        "Stock Control Manager",
        "Sales Manager",
        "Admin Manager",
        "Retail Department Manager",
        "Trade Department Manager",
        "Opening A Manager",
        "Closing A Manager",
        "HR Manager",
        "Store Manager"
    ];
    static regionList = [
        "JHB East",
        "JHB West",
        "JHB South & Free State",
        "PTA",
        "PTA East & Mpumalanga",
        "KZN North",
        "KZN South",
        "Eastern Cape",
        "Western Cape West",
        "Western Cape East",
        "Superstores Western Cape",
        "Superstores Mpumalanga",
        "Superstores Eastern Cape",
        "Superstores Gauteng",
        "Superstores Kwazulu Natal",
        "Africa"            
    ];
    static typeList = [
        "Admin", 
        "Employee"
    ];
    static isFirstRun = false;
    static checklistTypes = [
        "Daily",
        "Weekly",
        "Monthly"
    ];
    static resolvePresence (code) {
        /**This function returns the textual representation of a presence given the code */
        let retVal = "";
        switch (code) {
            case 1: {
                retVal = "Present";
                break;
            }
            case -1: {
                retVal = "Annual Leave";
                break;
            }
            case -2: {
                retVal = "Sick Leave";
                break;
            }
            case -3: {
                retVal = "Unpaid Leave";
                break;
            }
            default: {
                retVal = "Absent";
                break;
            }
        }
        return retVal;
    }
    static async resolveCompany (companyCode) {
        /**
         * Resolves company and returns the url pointing to said company's database
         * Sends request to defServerUrl as this is the place where the global database is hosted (Storeboss database)
         */
        try {
            let response = await fetch(this.defServerUrl + 'global.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "company_resolve",
                    companyCode: companyCode
                })
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.error(error, "Api.resolveCompany");
        }
    }
    static async populateLists () {
        /**
         * This function is used to populate static lists like the branchList which will not be changed throughout the lifetime
         */
        /*this.getBranchList().then((theseBranches) => {
            this.branchList = theseBranches;
            console.log(Api.branchList, "branchList2");
        });
        AsyncStorage.getItem('isFirstRun').then((ox) => {
            if(ox == 1) {
                this.isFirstRun = false;
            } else {
                this.isFirstRun = true;
            }
        }).catch((ex) => {
            this.isFirstRun = true;
        });
        AsyncStorage.setItem('isFirstRun', '1');*/
        this.branchList = await this.getBranchList();
        if (await AsyncStorage.getItem('isFirstRun') == 1) {
            this.isFirstRun = false;
        } else {
            this.isFirstRun = true;
        }
        AsyncStorage.setItem('isFirstRun', '1');
        return true;
        
        //AsyncStorage.removeItem('isFirstRun');
    }
    static async authenticate (username, password) {
        try {
            let response = await fetch(this.serverUrl + 'login.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "user_auth",
                    email: username,
                    password: password
                })
            });
            console.log(response,"")
            console.log(JSON.stringify(response, null, 4))
            let responseJson = await response.json();
            console.error(responseJson,"Sometvmv")
            this.userInfo = responseJson.user;
            return responseJson;
        } catch (error) {
            console.error(error, "Api.authenticate");
        }
    }
    static async verifyToken (userToken) {
        try {
            let response = await fetch(this.serverUrl + 'login.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "user_verifyToken",
                    token: userToken 
                })
            });
            let responseJson = await response.json();
            this.userInfo = responseJson;
            console.log(this.userInfo);
            return responseJson;
        } catch (error) {
            console.log(error, "Api.verifyToken");
        }
    }
    static async logOut () {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('apiUrl');
            let response = await fetch(this.serverUrl + 'login.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "user_logOut"
                })
            });
            let responseText = await response.text();
            return responseText;
        } catch (error) {
            console.error(error);
        }
    }
    static async getBranchList() {
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "getBranchList"
                })
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }
    static async updateUserProfile(userId, thisUser) {
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "updateUserProfile",
                    uid: userId,
                    json: JSON.stringify(thisUser)
                })
            });
            let responseText = await response.text();
            return responseText;
        } catch (error) {
            throw(error);
        }
    }
    static async deleteUser(userId) {
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "deleteUser",
                    id: userId,
                })
            });
            let responseText = await response.text();
            return responseText;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
    static async getUsers(filters, isSearch, sort) {
        let payload = { command: "getUsers", isSearch: isSearch };
        if (typeof filters.humanName !== "undefined") {
            payload['humanName'] = filters.humanName;
        }
        if (typeof filters.branch !== "undefined") {
            payload['branch'] = filters.branch;
        }
        if (typeof filters.position !== "undefined") {
            payload['position'] = filters.position;
        }
        if (typeof filters.userId !== "undefined") {
            payload['userId'] = filters.userId;
        }
        if (typeof sort !== "undefined") {
            payload["sort"] = sort.sortBy;
            payload["sortOrder"] = sort.sortOrder;
        }
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            throw(error);
        }
    }
    static async getEmployeesOfBranch(branchId) {
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "getEmployeesOfBranch",
                    branchId: branchId
                })
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            throw(error);
        }
    }
    static async getAttendance(branchId, strDate) {
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "getAttendance",
                    branchId: branchId,
                    date: strDate
                })
            });
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            throw(error);
        }
    }
    /*static async modifyAttendance(status, entityId, strDate) {
        let payload = {
            command: status ? "insertAttendance": "deleteAttendance"
        }, json = {};
        if (status) {
            //insert new attendance
            json = {
                userId: entityId,//in this case, entityId is user id
                date: strDate
            };
            payload["json"] = JSON.stringify(json);
        } else {
            payload["id"] = entityId;//in this case, entityId is attendance id
        }
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            let responseJson = await response.text();
            return responseJson;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }*/
    static async modifyAttendance(status, entityId, strDate) {
        let payload = {
            command: status == 0 ? "deleteAttendanceByUserId": "insertAttendance"
        }, json = {};
        /*if (status != 0) {
            //insert new attendance
            json = {
                userId: entityId,//in this case, entityId is user id
                date: strDate,
                type: status
            };
            payload["json"] = JSON.stringify(json);
        } else {
            payload["id"] = entityId;//in this case, entityId is attendance id
        }*/
        json = {
            userId: entityId,//in this case, entityId is user id
            date: strDate,
            type: status
        };
        payload["json"] = JSON.stringify(json);
        try {
            let response = await fetch(this.serverUrl + 'api.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            let responseJson = await response.text();
            return responseJson;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
    static download = {
        get: async (filter) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "download_get",
                        type: filter.category,
                        search: filter.search,
                        downloadId: filter.downloadId
                    })
                });
                
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                console.log(error);
                throw(error);
            }
        },
        remove: async (downloadId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "download_delete",
                        id: downloadId
                    })
                });
                let responseText = await response.text();
                return responseText;
            } catch (error) {
                console.log(error);
                throw(error);
            }
        },
    };
    static reporting = {
        allStats: async (strDate, categoryId = 1, branchId = Api.userInfo.branchId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "getTotalSales",
                        date: strDate,
                        categoryId: categoryId,
                        branchId: branchId
                    })
                });
                
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                console.log(error, "Api.reporting.allStats");
                throw(error);
            }
        },
        salesStats: async (strDate, branchId = Api.userInfo.branchId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "getSalesStats",
                        date: strDate,
                        branchId: branchId
                    })
                });
                
                let responseJson = await response.json();
                console.log(responseJson);
                return responseJson;
            } catch (error) {
                console.log(error, "Api.reporting.salesStats");
                throw(error);
            }
        },
        growthStats: async (strDate, branchId = Api.userInfo.branchId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "getGrowthStats",
                        date: strDate,
                        branchId: branchId
                    })
                });
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                throw(error);
            }
        }
    }

    static stats = {
        setAll: async (strDate, categoryId = 1, theseSales, branchId = Api.userInfo.branchId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "setTotalSales",
                        date: strDate,
                        branchId: branchId,
                        categoryId: categoryId,
                        json: JSON.stringify(theseSales)
                    })
                });
                let responseText = await response.text();
                return responseText;
            } catch (error) {
                console.log(error);
                throw(error);
            }
        }
    }

    static checklist = {
        getScore: async (username) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "getUserStatus",
                        username: username
                    })
                });
                let responseText = await response.text();
                return parseInt(responseText);
            } catch (error) {
                throw(error);
            }
        },
        get: async (filters, noQuestions = false) => {
            const payload = {
                command: 'checklist_get',
                noQuestions: noQuestions
            };
            

            if (typeof filters.branchId !== "undefined") {
                payload.branch = filters.branchId;
            }
            if (typeof filters.userId !== "undefined") {
                payload.userId = filters.userId;
            }
            if (typeof filters.checklistId !== "undefined") {
                payload.checklistId = filters.checklistId;
            }
            if (typeof filters.searchTerm !== "undefined") {
                payload.title = filters.searchTerm;
            }
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                let responseJson = await response.json();
                console.log(responseJson);
                return responseJson;
            } catch (error) {
                throw(error);
            }
        },
        insert: async (info, questions) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_insert",
                        info: JSON.stringify(info),
                        questions: JSON.stringify(questions)
                    })
                });

                let responseText = await response.text();
                return parseInt(responseText); //id of the newly inserted checklist
            } catch (error) {
                console.error(error);
            }
        },
        getWithAnswers: async (checklistId, strDate) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_getWithAnswers",
                        id: checklistId,
                        date: strDate
                    })
                });
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                console.log(error);
                throw(error);
            }
        },
        modify: async (checklistId, thisChecklistInfo) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_modify",
                        id: checklistId,
                        json: JSON.stringify(thisChecklistInfo)
                    })
                });
                let responseJson = await response.text();
                return responseJson;
            } catch (error) {
                console.error(error);
            }
        },
        modifyTick: async (questionId, strDate, isTicked) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: (isTicked ? "checklist_addTick": "checklist_removeTick"),
                        questionId: questionId,
                        date: strDate
                    })
                });
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                console.log(error);
                throw(error);
            }
        },
        insertQuestion: async (checklistId, strQuestion) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_addQuestion",
                        checklistId: checklistId,
                        question: strQuestion
                    })
                });
                let responseJson = await response.json();
                return responseJson;
            } catch (error) {
                console.error(error);
            }
        },
        modifyQuestion: async (questionId, strQuestion) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_modifyQuestion",
                        questionId: questionId,
                        question: strQuestion
                    })
                });
                let responseJson = await response.text();
                return responseJson;
            } catch (error) {
                console.error(error);
            }
        },
        delete: async (checklistId) => {
            try {
                let response = await fetch(Api.serverUrl + 'api.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "checklist_delete",
                        checklistId: checklistId
                    })
                });
                let responseJson = await response.text();
                return responseJson;
            } catch (error) {
                console.error(error);
            }
        }
    }
}
function helper() {

    const {
        getData,
        getUserData,
        setData
    } = firebase_helper();

    const qs = q => document.querySelector(q);

    const dom = {
        meal: {
            one: {
                up: qs("#u1"),
                result: qs("#r1"),
                down: qs("#d1"),
            },
            two: {
                up: qs("#u2"),
                result: qs("#r2"),
                down: qs("#d2"),
            },
            three: {
                up: qs("#u3"),
                result: qs("#r3"),
                down: qs("#d3"),
            }
        }
    };

    const state = {
        meal: {
            one: {
                up: 0,
                down: 0
            },
            two: {
                up: 0,
                down: 0
            },
            three: {
                up: 0,
                down: 0
            }
        },
        user: {
            one: {
                up: false,
                down: false
            },
            two: {
                up: false,
                down: false
            },
            three: {
                up: false,
                down: false
            }
        }
    };

    async function initState() {

        // Get user uid (or create a new user)
        let uid = window.localStorage.getItem("uid");
        if (uid === null) {
            uid = Math.floor(Math.random() * 1000000);
            window.localStorage.setItem("uid", uid);
            setData("users", uid.toString(), {
                one: {
                    up: false,
                    down: false,
                },
                two: {
                    up: false,
                    down: false,
                },
                three: {
                    up: false,
                    down: false,
                }
            });
        }

        // Get current meals and user data
        const data = await getData();
        const user = await getUserData(uid);

        // Load data into state
        const meals = ["one", "two", "three"];
        const dir = ["up", "down"];
        for (let m of meals) {
            for (let d of dir) {
                state.meal[m][d] = data[m][d];
                state.user[m][d] = user[m][d];
            }
        }
        
        // Render state
        render(state);

        // Set up click events
        for (let m of meals) {
            for (let d of dir) {
                dom.meal[m][d].addEventListener("click", e => {
                    setState(async state => {
                        const od = d === "up" ? "down" : "up";
                        const value = state.user[m][d];
                        const other = state.user[m][od];
                        
                        // Update state
                        state.user[m][d] = !value;

                        // If other is true flip to false
                        let swap = false;
                        if(other) {
                            swap = true;
                            state.user[m][od] = false;
                        }
                        
                        state.meal[m][d] = state.meal[m][d] + (!value ? 1 : -1);
                        state.meal[m][od] = state.meal[m][od] + (other ? -1 : 0);
       
                        // Update users collection
                        setData("users", uid, state.user);
        
                        // Update meals
                        const data = await getData();
                        setData("meal", m, {
                            [d]: data[m][d] + (!value ? 1 : -1),
                            [od]: data[m][od] - (swap ? 1 : 0)
                        });
                    });
                });
            }
        }
    }

    async function setState(func) {
        await func(state);
        render(state);
    }

    function render({ meal, user }) {
        const meals = ["one", "two", "three"];
        const dir = ["up", "down"];
        for (let m of meals) {
            for (let d of dir) {
                if (user[m][d]) {
                    dom.meal[m][d].classList.add("active");
                } else {
                    dom.meal[m][d].classList.remove("active");
                }
            }
            dom.meal[m].result.innerHTML = meal[m].up - meal[m].down;
        }
    }

    return {
        initState
    };
}
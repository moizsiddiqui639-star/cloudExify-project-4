```javascript
// ========================================
// REGISTER
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get form values
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");


        // Check passwords
        if (password !== confirmPassword) {

            message.innerHTML = `
                <div class="error-message">
                    Passwords do not match.
                </div>
            `;

            return;
        }


        // Password length
        if (password.length < 6) {

            message.innerHTML = `
                <div class="error-message">
                    Password must be at least 6 characters.
                </div>
            `;

            return;
        }


        try {

            // Create Supabase account
            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });


            if (error) {
                throw error;
            }


            // Create profile
            if (data.user) {

                const { error: profileError } =
                    await supabaseClient
                        .from("profiles")
                        .insert([
                            {
                                id: data.user.id,
                                full_name: fullName,
                                role: "customer"
                            }
                        ]);


                if (profileError) {
                    throw profileError;
                }
            }


            message.innerHTML = `
                <div class="success-message">
                    Registration successful!
                    You can now login.
                </div>
            `;


            // Clear form
            registerForm.reset();


        } catch (error) {

            console.error(error);

            message.innerHTML = `
                <div class="error-message">
                    ${error.message}
                </div>
            `;

        }

    });

}



// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get values
        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        try {

            // Login user
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            if (error) {
                throw error;
            }


            // Get logged-in user
            const user = data.user;


            // Get profile
            const { data: profile, error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();


            if (profileError) {
                throw profileError;
            }


            // Admin redirect
            if (profile.role === "admin") {

                window.location.href = "admin.html";

            }

            // Customer redirect
            else {

                window.location.href = "index.html";

            }


        } catch (error) {

            console.error(error);

            message.innerHTML = `
                <div class="error-message">
                    ${error.message}
                </div>
            `;

        }

    });

}



// ========================================
// LOGOUT
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        try {

            const { error } =
                await supabaseClient.auth.signOut();


            if (error) {
                throw error;
            }


            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    });

}
```

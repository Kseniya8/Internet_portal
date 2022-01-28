import {errorMsg} from '/javascripts/errorMessage.js'

function OpenModel(text){
    $('.modal').find('p').text(text);
    $('.modal').modal();
}

 const App = {
    data: () => ({
            header: document.querySelector('html').lang === 'ru' ? 'Вход в личный кабинет' : 'Log in to your personal account',
            inputEmail: '',
            inputPassword: '',
            msg: '',
            email_visible: true,
            password_visible: true,
            login_button_visible: true,
            reg_button_visible: false,
            reset_button_visible: false,
            switch_login_button_visible: false,
            switch_reg_button_visible: true,
            switch_reset_button_visible: true, 
            reg_button_disabled: false, 
            reset_button_disabled: false,
            login_button_disabled: false,
            lang: document.querySelector('html').lang,    
            
    }),
    delimiters: ['{%', '%}'],

    methods: {
        SwitchToLogin() {
            this.header = (this.lang === 'ru' ? "Вход в личный кабинет" : 'Log in to your personal account')
            this.email_visible = true
            this.password_visible = true

            this.switch_login_button_visible = false
            this.switch_reg_button_visible = true
            this.switch_reset_button_visible = true   

            this.login_button_visible = true
            this.reg_button_visible =  false
            this.reset_button_visible = false
        },
    
        SwitchToReg(){
            this.header = (this.lang === 'ru' ? 'Регистрация' : 'Registration')      
            this.email_visible = true
            this.password_visible = true

            this.switch_login_button_visible = true
            this.switch_reg_button_visible = false
            this.switch_reset_button_visible = true       

            this.login_button_visible = false
            this.reg_button_visible =  true
            this.reset_button_visible = false
        },
    
        SwitchToResetPass() {
            this.header = (this.lang === 'ru' ? 'Сброс пароля' : 'Password reset')
            this.email_visible = true
            this.password_visible = false
           
            this.switch_login_button_visible = true
            this.switch_reg_button_visible = true
            this.switch_reset_button_visible = false    

            this.login_button_visible = false
            this.reg_button_visible =  false
            this.reset_button_visible = true
        },

        LoginButtonClick(){
   
            if(!this.inputEmail) { OpenModel(this.lang == 'ru' ? 'Вы не ввели email' : 'E-mail is not entered'); return; }
            if(!this.inputPassword) { OpenModel(this.lang == 'ru' ? 'Вы не ввели пароль' : 'Password is not entered'); return; }
            if (this.inputPassword.length < 6) {OpenModel(this.lang == 'ru' ? 'Пароль слишком короткий, должно быть более 6 символов' : 'The password is too short, must be more than 6 characters'); return;}
        
            this.login_button_disabled = true
            var request = new XMLHttpRequest();
            request.open('POST','/account/login',true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = () => { 
                if (request.readyState === 4)
                    if (request.status === 200) {
                        var answer = JSON.parse(request.responseText);
                        if (answer.success){
                            if (answer.role == "admin") window.location.href = "/admin"
                            else window.location.href = "/account/form"
                        } else OpenModel(answer.msg);
                        this.login_button_disabled = false
                    }
                    else {
                        OpenModel(errorMsg);
                    }
            }
            var data = JSON.stringify({"email": this.inputEmail, "password": this.inputPassword });
            request.send(data);
        },

        RegButtonClick(){
            
            if(!this.inputEmail) { OpenModel(this.lang == 'ru' ? 'Вы не ввели email' : 'E-mail is not entered'); return; }
            if(!this.inputPassword) { OpenModel(this.lang == 'ru' ? 'Вы не ввели пароль' : 'Password is not entered'); return; }
            if (this.inputPassword.length < 6) {OpenModel(this.lang == 'ru' ? 'Пароль слишком короткий, должно быть более 6 символов' : 'The password is too short, must be more than 6 characters'); return;}
        
            this.reg_button_disabled = true
            var request = new XMLHttpRequest();
            request.open('POST','/account/reg',true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = () => { 
                if (request.readyState === 4)
                    if (request.status === 200) {
                        var answer = JSON.parse(request.responseText);
                        OpenModel(answer.msg);
                    }
                    else {
                        OpenModel(errorMsg);
                    }
                this.reg_button_disabled = false;      
            }
            var data = JSON.stringify({"password": this.inputPassword, "email": this.inputEmail });
            request.send(data);
        },

        ResetPassClick() {

            if(!this.inputEmail) { OpenModel(this.lang == 'ru' ? 'Вы не ввели email' : 'E-mail is not entered'); return; }
        
            this.reset_button_disabled = true;
            var request = new XMLHttpRequest();
            request.open('POST','/account/reset_pass/send_link',true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = () => { 
                if (request.readyState === 4)
                    if (request.status === 200) { 
                        var answer = JSON.parse(request.responseText);
                        OpenModel(answer.msg);
                    }
                    else {
                        OpenModel(errorMsg);
                    }
                this.reset_button_disabled = false;
            }
            var data = JSON.stringify({"email": this.inputEmail});
            request.send(data);
        },

        emailKeyPressHandler(){
            if(this.login_button_visible || this.reg_button_visible) document.getElementById("password").focus();
            else this.ResetPassClick()
        },

        loginKeyPressHandler (){
            if (this.login_button_visible) this.LoginButtonClick()
            else this.RegButtonClick()
        }
    }
}

<<<<<<< HEAD
Vue.createApp(App).mount('#auth-section')
=======
Vue.createApp(App).mount('#auth-section')
>>>>>>> master

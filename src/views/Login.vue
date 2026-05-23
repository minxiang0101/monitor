<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-form-wrapper">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
          @keyup.enter.native="handleLogin" label-position="top">
          <p class="login-title-sm">欢迎你</p>
          <h2 class="login-title">智慧工地</h2>

          <el-form-item prop="username" label="账号">
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text"
              tabindex="1" auto-complete="on" @input="onUsernameInput" prefix-icon="el-icon-user" />
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码"
              name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" @input="onPasswordInput"
              prefix-icon="el-icon-lock">
              <template slot="append">
                <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-minus'" @click="showPwd"
                  class="pwd-toggle"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  computed: {
    ...mapGetters(['project'])
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  },
  methods: {
    onUsernameInput(val) {
      this.loginForm.username = val.replace(/\s+/g, '');
    },
    onPasswordInput(val) {
      this.loginForm.password = val;
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password';
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    encryptPassword(password) {
      const key = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_CRYPTO_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.VUE_APP_CRYPTO_IV);
      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const key = process.env.VUE_APP_CRYPTO_KEY;
          const iv = process.env.VUE_APP_CRYPTO_IV;

          if (!key || !iv) {
            this.$message.error('加密配置错误，请联系管理员。');
            this.loading = false;
            return;
          }

          const encryptedPassword = this.encryptPassword(this.loginForm.password);
          const encryptedUsername = this.encryptPassword(this.loginForm.username);

          this.$store.dispatch('login', {
            username: encryptedUsername,
            password: encryptedPassword
          })
            .then(() => {
              this.$router.push({ path: this.redirect || '/video' })
              document.getElementsByTagName('body')[0].style.overflow = 'auto'
              this.loading = false
            })
            .catch((error) => {
              this.$message.error(error.message || '登录失败');
              this.loading = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background-color: #0A2B58;
  position: relative;

  .login-main {
    position: relative;
    width: 1300px;
    height: 740px;
    background: url(../../public/images/l-bg.png) no-repeat center center;
    border-radius: 10px;
  }

  .login-form-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 530px;
    display: flex;
    // justify-content: center;
    // align-items: center;
    background: white;
    padding: 100px 80px 0;
    border-radius: 0 10px 10px 0;

    .login-form {
      width: 100%;
      // max-width: 350px;

      .login-title-sm {
        color: #666;
        font-size: 20px;
      }

      .login-title {
        // text-align: center;
        color: #333;
        margin-bottom: 50px;
        font-size: 40px;
      }

      .el-input {
        .pwd-toggle {
          cursor: pointer;
          color: #409EFF;
        }
      }

      .login-button {
        width: 100%;
        margin-top: 20px;
        background-color: #0089ED;
      }

      .login-extras {
        text-align: right;
        margin-top: 10px;
      }
    }
  }

  // Element UI overrides
  .el-input__prefix {
    left: 10px;
  }

  .el-input__suffix {
    right: 10px;
  }

}
</style>
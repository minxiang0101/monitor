<template>
    <div class="header">
        <!-- 天气 -->
        <!-- <div class="weather">
            <div id="ww_9c0ba9b2508b3" v='1.3' loc='auto'
                a='{"t":"ticker","lang":"zh","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FFFFFF00","cl_font":"rgba(255,255,255,1)","cl_cloud":"#d4d4d4","cl_persp":"#2196F3","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'>
                <a href="https://weatherwidget.org/zh/" id="ww_9c0ba9b2508b3_u" target="_blank">天气插件</a>
            </div>
        </div> -->
        <div class="marquee-container" id="marquee-container">
            <div class="marquee-content" id="marquee-content">{{ marqueeText }}</div>
        </div>
        <el-dropdown class="header-dropdown" size="small" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
                你好：{{ userInfo?.realname }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-switch-button" command="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 块状动画 -->
        <div class="gradient left line-box">
            <div class="line" v-for="n in 16" :key="'left-' + n"></div>
        </div>
        <div class="gradient right line-box">
            <div class="line" v-for="n in 16" :key="'right-' + n"></div>
        </div>
        <!-- 发光标记 -->
        <div class="header-mark">
            <svg xmlns="http://www.w3.org/2000/svg" width="561" height="114" viewBox="0 0 561 114" fill="none">
                <defs>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:0" />
                        <stop offset="30%" style="stop-color:#f5f5f5;stop-opacity:0" />
                        <stop offset="50%" style="stop-color:#f5f5f5;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#f5f5f5;stop-opacity:0" />
                        <stop offset="100%" style="stop-color:#f5f5f5;stop-opacity:0" />
                    </linearGradient>
                    <!-- 发光滤镜 -->
                    <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"
                            result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path class="glow-path" fill-rule="evenodd" clip-rule="evenodd"
                    d="M560.654 0.5L508.87 69.8753C490.073 97.4006 461.172 113.5 430.556 113.5H130.753C100.136 113.5 71.2352 97.4006 52.439 69.8753L0.654297 0.5H560.654Z" />
            </svg>
        </div>
        <!-- logo -->
        <div class="logo">智慧工地指挥中心</div>
        <!-- nav  -->
        <div class="nav" style="display: flex;">
            <div class="nav-left">
                <template v-for="(item, index) in  leftNavItems">
                  <a :key="index" :href="isClickable(item) ? getLInk(item.href) : 'javascript:void(0)'"
                     :class="{ cur: isCurrentRoute(item.href), disabled: !isClickable(item) }"
                       @click="!isClickable(item) && $event.preventDefault()">
                        {{ item.text }}<i v-if="getFilteredChildren(item.children).length"></i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="136" height="45" viewBox="0 0 136 45" fill="none"
                            class="nav-path">
                            <path d="M147.798 40L24.362 40C23.6492 40 22.9902 39.6206 22.6323 39.0042L0.566895 1"
                                stroke="transparent" />
                            <circle class="moving-ball" r="2" fill="#6C9BFF" />
                        </svg>
                        <ul v-if="getFilteredChildren(item.children).length">
                            <li v-for="(child, childIndex) in getFilteredChildren(item.children)" :key="childIndex"
                                :class="{ disabled: !isClickable(child) }"
                                @click="isClickable(child) ? openpage(child.href, $event) : $event.preventDefault()">{{ child.text }}</li>
                        </ul>
                    </a>
                </template>
            </div>
            <div class="nav-right">
                <template v-for="(item, index) in rightNavItems">
                  <a :key="index" :href="isClickable(item) ? getLInk(item.href) : 'javascript:void(0)'"
                     :class="{ cur: isCurrentRoute(item.href), disabled: !isClickable(item) }"
                       @click="!isClickable(item) && $event.preventDefault()">
                        {{ item.text }}<i v-if="getFilteredChildren(item.children).length"></i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="136" height="45" viewBox="0 0 136 45" fill="none"
                            class="nav-path">
                            <path d="M147.798 40L24.362 40C23.6492 40 22.9902 39.6206 22.6323 39.0042L0.566895 1"
                                stroke="transparent" />
                            <circle class="moving-ball" r="2" fill="#6C9BFF" />
                        </svg>
                        <ul v-if="getFilteredChildren(item.children).length">
                            <li v-for="(child, childIndex) in getFilteredChildren(item.children)" :key="childIndex"
                                :class="{ disabled: !isClickable(child) }"
                                @click="isClickable(child) ? openpage(child.href, $event) : $event.preventDefault()">{{ child.text }}</li>
                        </ul>
                    </a>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getArUrl } from '@/api/index';
export default {
    data() {
        return {
            marqueeText: '项目信息加载中...',
            arUrlAvailable: false, // AR监控URL是否可用
            leftNavItems: [
                {
                    text: '视频监控',
                    href: '/video',
                    permission: 'isVideo',
                    children: []
                }
            ],
            rightNavItems: []
        }
    },
    computed: {
        ...mapGetters(['project', 'userInfo','roles']),
        currentPath() {
            return this.$route.path;
        },

        isCurrentRoute() {
            return (href) => {
                if (this.currentPath === href) return true;
                // 检查是否为父级路由
                if (href !== '/' && this.currentPath.startsWith(href + '/')) return true;
                return false;
            };
        },
    },
    watch: {
        project: {
            handler(newVal) {
                if (newVal && newVal.projectName) {
                    this.marqueeText = newVal.projectName;
                } else {
                    this.marqueeText = '项目信息加载中...'; // 恢复默认值
                }
                // DOM 更新是异步的，确保在文本更新后再设置跑马灯
                this.$nextTick(() => {
                    const container = document.getElementById('marquee-container');
                    const content = document.getElementById('marquee-content');
                    // 确保元素存在再调用 setupMarquee，因为 immediate:true 可能在 DOM 未完全就绪时触发
                    if (container && content) {
                        this.setupMarquee('marquee-container', 'marquee-content');
                    }
                });
            },
            immediate: true, // 在组件创建时立即执行一次，以处理初始 project 值
            // deep: true, // 如果 project 是深度嵌套对象且其内部非响应式属性变化也需侦听，可以开启
        },
        userInfo(newVal) {
            if (newVal) {
                // console.log(newVal)
                // userInfo 加载完成后的逻辑
            }
        }
    },
    mounted() {
        // 检查AR监控URL是否可用
        this.checkArUrl();
        
        // // 加载天气插件脚本
        // const weatherScriptId = 'weather-widget-script';
        // if (!document.getElementById(weatherScriptId)) {
        //     const script = document.createElement('script');
        //     script.id = weatherScriptId;
        //     script.async = true;
        //     script.src = 'https://app3.weatherwidget.org/js/?id=ww_9c0ba9b2508b3';
        //     document.head.appendChild(script);
        // } else {
        //     // 如果脚本已存在，尝试调用其更新函数 (如果widget提供了此类接口)
        //     // 根据 https://app3.weatherwidget.org/js/?id=ww_9c0ba9b2508b3 的内容，它会自动执行 updateWidget
        //     // 如果需要手动触发，可能需要检查该脚本是否暴露了可调用的函数
        //     if (typeof window.updateWidget === 'function') {
        //         // window.updateWidget('ww_9c0ba9b2508b3', 0); // 假设有这样一个全局函数，根据实际情况调整
        //     }
        // }

        document.querySelectorAll('.line').forEach((line) => {
            // 随机延迟
            const delay = Math.random() * 0.3;
            // 随机持续时间
            const duration = 0.5 + Math.random() * 0.4;

            line.style.animation = `pulse ${duration}s ease-in-out infinite alternate ${delay}s`;
        });
    },
    methods: {
        getLInk(e) {
            if (process.env.NODE_ENV === 'production') {
                return `/monitor${e}`
            }else {
                return `${e}`
            }

        },
        handleCommand(command) {
            switch (command) {
                case 'loginOut':
                    this.$store.dispatch('logout');
                    break;
            }

        },
        openpage(href, e) {
            e.preventDefault();
            e.stopPropagation();
            // let targetHref = href;
            // 在生产环境下，手动添加/dp前缀
            // if (process.env.NODE_ENV === 'production') {
            //     targetHref = '/dp' + href;
            // }
            this.$router.push(href);
            // window.location.href = href;
        },
        // 检查权限
        hasPermission(permission) {
            if (!permission) return true; // 如果没有设置权限要求，默认显示
            if (!this.roles) return true; // 如果没有权限数据，默认显示（避免初始加载时隐藏所有导航）
            if (Array.isArray(this.roles) && this.roles.length === 0) return true; // 空数组时默认显示
            if (typeof this.roles !== 'object') return true; // 非对象类型时默认显示
            return this.roles[permission] === 1; // 检查对应权限字段是否为1
        },
        // 检查是否可点击（有权限）
        isClickable(item) {
            return this.hasPermission(item.permission);
        },
        // 过滤有权限的子菜单项
        getFilteredChildren(children) {
            if (!children) return [];
            return children.filter(child => this.hasPermission(child.permission));
        },
        setupMarquee(containerId, contentId) {
            const container = document.getElementById(containerId);
            const content = document.getElementById(contentId);

            if (!container || !content) {
                // console.warn(`Marquee elements not found: ${containerId}, ${contentId}. Skipping setup.`);
                return; // 如果元素未找到，则退出
            }

            // 清除之前的动画
            if (container._animationId) {
                cancelAnimationFrame(container._animationId);
                container._animationId = null;
            }

            // 重置内容位置
            content.style.left = '0px';

            // 获取内容和容器的宽度
            const contentWidth = content.offsetWidth;
            const containerWidth = container.offsetWidth;

            // 如果内容宽度不超过容器宽度，不需要滚动
            if (contentWidth <= containerWidth) {
                return;
            }

            // 设置初始位置
            let position = 0;
            // 根据内容长度调整速度，越长速度越快，保证阅读时间
            const speed = Math.max(0.5, Math.min(2, contentWidth / 400));

            // 开始动画
            const animate = () => {
                position -= speed;

                // 当文本完全移出视野后，重置位置实现无缝循环
                if (position <= -containerWidth) {
                    position = containerWidth;
                }

                content.style.left = position + 'px';
                container._animationId = requestAnimationFrame(animate);
            }

            // 开始动画
            container._animationId = requestAnimationFrame(animate);
        },
        // 检查AR监控URL是否可用
        async checkArUrl() {
            try {
                const response = await getArUrl();
                const arUrl = response.data;
                
                // 判断AR URL是否为空或null
                if (arUrl && arUrl.trim() !== '') {
                    this.arUrlAvailable = true;
                    // 动态添加AR监控子菜单
                    const videoNavItem = this.leftNavItems.find(item => item.href === '/video');
                    if (videoNavItem && !videoNavItem.children.some(child => child.href === '/video/ar')) {
                        videoNavItem.children.push({
                            text: 'AR监控',
                            href: '/video/ar',
                            permission: 'isVideo'
                        });
                    }
                } else {
                    this.arUrlAvailable = false;
                    // 移除AR监控子菜单（如果存在）
                    const videoNavItem = this.leftNavItems.find(item => item.href === '/video');
                    if (videoNavItem) {
                        videoNavItem.children = videoNavItem.children.filter(child => child.href !== '/video/ar');
                    }
                }
            } catch (error) {
                console.warn('获取AR监控URL失败:', error);
                this.arUrlAvailable = false;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.header-dropdown {
    position: absolute;
    z-index: 998;
    right: 20px;
    top: 10px;
    color: #fff;
    cursor: pointer;
}

.weather {
    z-index: 999;
    position: absolute;
    right: 170px;
    width: 180px;
}

/* 禁用状态样式 */
.nav a.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.nav a.disabled:hover {
    opacity: 0.4;
}

.nav ul li.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.nav ul li.disabled:hover {
    opacity: 0.4;
    background-color: transparent;
}
</style>
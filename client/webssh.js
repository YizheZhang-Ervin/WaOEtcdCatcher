export default {
    props: {
    },
    watch: {
    },
    mounted() {
        this.initSocket();
    },
    data() {
        return {
            // same with server websocket port
            socketURI: `ws://localhost:4999/`,
            wsTime: null,
            term: null,
            socket: null
        }
    },
    methods: {
        initTerm() {
            let element = document.getElementById("xterm");
            // 设置了cols或者fitAddon.fit(); 当一行字符超过80个过会替换现在的内容，否则换行
            const term = new Terminal({
                rendererType: "canvas", //渲染类型
                // rows: 40, //行数，影响最小高度
                // cols: 100, // 列数，影响最小宽度
                convertEol: true, //启用时，光标将设置为下一行的开头
                cursorBlink: true, // 关标闪烁
                disableStdin: false, //是否应禁用输入
                cursorStyle: "underline", // 光标样式 'block' | 'underline' | 'bar'
                scrollback: 100, // 当行的滚动超过初始值时保留的行视窗，越大回滚能看的内容越多，
                theme: {
                    foreground: '#F8F8F8',
                    background: '#2D2E2C',
                    cursor: "help", //设置光标
                    lineHeight: 16,
                },
                fontFamily: '"Cascadia Code", Menlo, monospace'
            });
            this.term = term;
            const fitAddon = new FitAddon.FitAddon();
            // 用AttachAddOn就不要写onMessage和onData了
            // const attachAddon = new AttachAddon.AttachAddon(this.socket)
            // this.term.loadAddon(attachAddon)
            this.term.loadAddon(fitAddon);
            this.fitAddon = fitAddon;
            term.open(element);
            // 自适应大小(使终端的尺寸和几何尺寸适合于终端容器的尺寸)，初始化的时候宽高都是对的
            fitAddon.fit();
            term.focus();

            this.term.onData((data) => {
                this.socket.send(data);
            });

            window.addEventListener("resize", this.resizeTerm);

            // 自定义终端默认展示内容
            this.writeDefaultInfo()
        },
        resizeTerm() {
            this.fitAddon.fit();
            this.term.scrollToBottom();
        },
        initSocket() {
            if (!'WebSocket' in window) {
                console.log('Browser Not Support WebSocket..')
                return
            }
            this.socket = new WebSocket(this.socketURI);
            this.socketOnClose();
            this.socketOnOpen();
            this.socketOnError();
            this.socketOnMessage();
        },
        // 自定义终端默认展示内容
        writeDefaultInfo() {
            let defaultInfo = [
                '┌ terminals ─────────────────────────────────────────────────────────────────┐ ',
                '│                                                                            │ ',
                '│  Hello! Welcome to Use Web SSH                                             │ ',
                '│                                                                            │ ',
                '└────────────────────────────────────────────────────────────────────────────┘ ',]
            this.term.write(defaultInfo.join('\n\r'))
        },
        socketOnOpen() {
            this.socket.onopen = () => {
                // 连接成功后
                this.initTerm();
            };
        },
        socketOnMessage() {
            this.socket.onmessage = (event) => {
                // 接收推送的消息
                this.term.write(event.data.toString());
            };
        },
        socketOnClose() {
            this.socket.onclose = () => {
                console.log("close socket");
            };
        },
        socketOnError() {
            this.socket.onerror = () => {
                console.log("socket error");
                if (this.wsTime) {
                    window.clearTimeout(this.wsTime)
                    wsTime = null
                }
                this.wsTime = window.setTimeout(() => {
                    // pass
                }, 3000)
            };
        },
    },
    beforeDestroy() {
        this.socket.close();
        this.term && this.term.dispose();
    },
    template:
        `
        <section>
            <div id="xterm" class="webssh"></div>
        </section>
        `
}

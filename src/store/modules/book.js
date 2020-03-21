const book = {
    state: {
        fileName: '',
        // 是否显示阅读文章时上下的的设置选项
        menuVisible: false,
        // -1表示下方的设置面板不显示，0：字号，1：主题，2：进度，3：目录
        settingVisible: -1,
        // 默认字体
        defaultFontSize: 16,
        // 默认的字体样式
        defaultFontFamily: 'Default',
        // 是否显示 字体样式的面板
        fontFamilyVisible: false,
        // 默认的主题样式
        defaultTheme: 'Default',
        // 书是否加载完成，刚开始没加载完成时显示加载中
        bookAvailable: false,
        // 书的进度
        progress: 0,
        // 章节的内容
        section: 0,
        isPaginating: true,
        // currentBook 获取当前的电子书 把this.book传进来
        currentBook: null,
        navigation: null,
        cover: null,
        metadata: null,
        paginate: '',
        pagelist: null,
        // 向下的偏移量
        offsetY: 0,
        // 当前页是否为书签页
        isBookmark: null
    },
    mutations: {
        change_fileName: (state, fileName) => {
            state.fileName = fileName
        },
        change_menuVisible: (state, menuVisible) => {
            state.menuVisible = menuVisible
        },
        change_settingVisible: (state, settingVisible) => {
            state.settingVisible = settingVisible
        },
        change_defaultFontSize: (state, defaultFontSize) => {
            state.defaultFontSize = defaultFontSize
        },

        SET_DEFAULT_FONT_FAMILY: (state, font) => {
            state.defaultFontFamily = font
        },
        SET_FONT_FAMILY_VISIBLE: (state, visible) => {
            state.fontFamilyVisible = visible
        },
        SET_DEFAULT_THEME: (state, theme) => {
            state.defaultTheme = theme
        },
        SET_BOOK_AVAILABLE: (state, bookAvailable) => {
            state.bookAvailable = bookAvailable
        },
        SET_PROGRESS: (state, progress) => {
            state.progress = progress
        },
        SET_SECTION: (state, section) => {
            state.section = section
        },
        SET_IS_PAGINATING: (state, isPaginating) => {
            state.isPaginating = isPaginating
        },
        SET_CURRENT_BOOK: (state, currentBook) => {
            state.currentBook = currentBook
        },
        SET_NAVIGATION: (state, navigation) => {
            state.navigation = navigation
        },
        SET_COVER: (state, cover) => {
            state.cover = cover
        },
        SET_METADATA: (state, metadata) => {
            state.metadata = metadata
        },
        SET_PAGINATE: (state, paginate) => {
            state.paginate = paginate
        },
        SET_PAGELIST: (state, pagelist) => {
            state.pagelist = pagelist
        },
        SET_OFFSETY: (state, offsetY) => {
            state.offsetY = offsetY
        },
        SET_IS_BOOKMARK: (state, isBookmark) => {
            state.isBookmark = isBookmark
        }
    },
    modules: {
    }
}

export default book

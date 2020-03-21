// 将action分离出来，方便管理，在同文件下的index.js进行引用
const actions = {
    // 设置书籍的名字
    setFileName: ({ commit }, fileName) => {
        // console.log(state.test, newTese)
        return commit('change_fileName', fileName)
    },
    // 书籍上方和下方的导航栏
    setmenuVisible: ({ commit }, menuVisible) => {
        // console.log(state.test, newTese)
        return commit('change_menuVisible', menuVisible)
    },
    // 书籍下方的设计栏
    setSettingVisible: ({ commit }, settingVisible) => {
        // console.log(state.test, newTese)
        return commit('change_settingVisible', settingVisible)
    },
    // 默认字体
    setDefaultFontSize: ({ commit }, defaultFontSize) => {
        // console.log(state.test, newTese)
        return commit('change_defaultFontSize', defaultFontSize)
    },
    // 设置字体样式是否展示的面板
    setFontFamilyVisible: ({ commit }, visible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', visible)
    },
    setDefaultFontFamily: ({ commit }, font) => {
        return commit('SET_DEFAULT_FONT_FAMILY', font)
    },
    setMenuVisible: ({ commit }, visible) => {
        return commit('SET_MENU_VISIBLE', visible)
    },
    setDefaultTheme: ({ commit }, theme) => {
        return commit('SET_DEFAULT_THEME', theme)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    setIsPaginating: ({ commit }, isPaginating) => {
        return commit('SET_IS_PAGINATING', isPaginating)
    },
    // 设置当前书籍
    setCurrentBook: ({ commit }, book) => {
        return commit('SET_CURRENT_BOOK', book)
    },
    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    // 获取标题
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    // 获取封面信息
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    setPaginate: ({ commit }, paginate) => {
        return commit('SET_PAGINATE', paginate)
    },
    setPagelist: ({ commit }, pagelist) => {
        return commit('SET_PAGELIST', pagelist)
    },
    setIsBookmark({ commit }, isBookmark) {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setOffsetY({ commit }, offsetY) {
        return commit('SET_OFFSETY', offsetY)
    },
    setHotSearchOffsetY({ commit }, offsetY) {
        return commit('set_hot_search_offsety', offsetY)
    },
    setFlapCardVisible({ commit }, visible) {
        return commit('set_flap_card_visible', visible)
    },
  setIsEditMode({ commit }, isEditMode) {
    return commit('SET_IS_EDIT_MODE', isEditMode)
  },
  setShelfList({ commit }, list) {
    return commit('SET_SHELF_LIST', list)
  },
  setShelfSelected({ commit }, selected) {
    return commit('SET_SHELF_SELECTED', selected)
  },
  setShelfTitleVisible({ commit }, visible) {
    return commit('SET_SHELF_TITLE_VISIBLE', visible)
  }
}

export default actions

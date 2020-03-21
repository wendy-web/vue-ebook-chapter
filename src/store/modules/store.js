const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    // 是否进入编辑模式
    isEditMode: false,
    // 书架图书列表
    shelfList: [],
    // 书架图书选中列表
    shelfSelected: [],
    // 书籍标题的选中状态
    shelfTitleVisible: true
  },
  mutations: {
    set_hot_search_offsety(state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    set_flap_card_visible(state, visible) {
      state.flapCardVisible = visible
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST(state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED(state, selected) {
      state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE(state, visible) {
      state.shelfTitleVisible = visible
    }
  }
}
export default store

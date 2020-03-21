<template>
<div class='storeHome'>
  <flap-card :data="random"></flap-card>
  <search-bar></search-bar>
  <scroll @onScroll="onScroll" :top="scrollTop" ref="scroll">
    <div  class="banner-wrapper">
      <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
    </div>
    <!-- 猜你喜欢 -->
    <guess-you-like :data="guessYouLike"></guess-you-like>
    <!-- 热门推荐 -->
    <recommend :data="recommend" class="recommend"></recommend>
    <!-- 精选 -->
    <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured"></featured>
    <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
      <category-book :data="item"></category-book>
    </div>
    <!-- 分类 -->
    <category class="categories" :data="categories"></category>
  </scroll>
</div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar.vue'
import FlapCard from '../../components/home/FlapCard.vue'
import Scroll from '../../components/common/Scroll.vue'
import { storeHomeMixin } from '../../utils/mixin.js'
import { home } from '../../api/store.js'
import guessYouLike from '../../components/home/GuessYouLike.vue'
import recommend from '../../components/home/Recommend.vue'
import Featured from '../../components/home/Featured.vue'
import CategoryBook from '../../components/home/CategoryBook.vue'
import Category from '../../components/home/Category.vue'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    guessYouLike,
    recommend,
    Featured,
    CategoryBook,
    Category
  },
  methods: {
    onScroll(offsetY) {
      // console.log(offsetY)
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      // 更新滚动条
      this.$refs.scroll.refresh()
    }
  },
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  mounted() {
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        // console.log(data)
        // Match.random()是取0-1的随机数 并通过math.floor进行取整
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        // 图片的展示
        this.banner = data.banner
        // 猜你喜欢
        this.guessYouLike = data.guessYouLike
        // 热门推荐
        this.recommend = data.recommend
        // 精选
        this.featured = data.featured
        // 分类
        this.categoryList = data.categoryList
        this.categories = data.categories
      }
    })
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global';
.storeHome{
  width:100%;
  height:100%;
  .banner-wrapper{
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img{
      width: 100%;
      height: px2rem(140);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend{
    margin-top: px2rem(20);
  }
  .featured{
    margin-top: px2rem(20);
  }
  .category-list-wrapper{
    margin-top: px2rem(20);
  }
  .categories{
    margin-top: px2rem(20);
  }
}
</style>

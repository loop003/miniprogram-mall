// pages/detail/detail.js
import { getDetail, getRecommend,Goods, GoodsParam, Shop, Sku } from '../../request/detail'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImages: [],
    goodInfo: {},
    shopInfo: {},
    detailInfo: {},
    paramInfo: {},
    commentInfo:{},
    recommendList: [],
    navBarIndex: 0,
    skuInfos: {},
    skuVisible: false,
    isBuying: false,
    animationSku: {},
    skuVisible: false,
    currentSku: {},
    colorIndex: 0,
    sizeIndex: 0,
    goodsCount: 0,
    countOper: ''
  },
  styleId: 0,
  sizeId: 0,
  skuDom: {},
  slideUP: 800,
  tranPx: 0,

  onLoad: function (options) {
    this._getDetailData(options.iid)
    this._getRecommendData()
  },
  
  onShow() {
    const systemInfo = wx.getSystemInfoSync();
    this.tranY = this.slideUP / 750 * systemInfo.windowWidth;
  },
  onReachBottom: function () {

  },

  async _getDetailData(iid) {
    try {
      const res = await getDetail(iid)
      const data = res.result
      
      this.setData({
        goodInfo: new Goods(data.itemInfo, data.columns, data.shopInfo.services),
        shopInfo: new Shop(data.shopInfo),
        detailInfo: data.detailInfo,
        topImages: data.itemInfo.topImages,
        paramInfo: new GoodsParam(data.itemParams.info, data.itemParams.rule),
        commentInfo: data.rate.list ? data.rate : {},
        skuInfos: new Sku(data.skuInfo)
      })
    } catch (err) {
      console.log(err)
    }
  },
  async _getRecommendData() {
    try {
      const res = await getRecommend()
      this.setData({
        recommendList: res.data.list
      })
    } catch (err) {
      console.log(err)
    }
  },

  // sku
  getCurrentSku() {
    this.styleId =  this.data.skuInfos.color[this.data.colorIndex].styleId
    this.sizeId = this.data.skuInfos.sizes[this.data.sizeIndex].sizeId
    const sku = {...this.data.skuInfos.skus.find(item => {
      return item.styleId === this.styleId && item.sizeId === this.sizeId
    })}
    sku.nowprice = Number(sku.nowprice/100).toFixed(2)
    console.log(sku.nowprice);
    this.setData({
      currentSku: sku
    })
  },
  addCart() {
    this.getCurrentSku()
    this.setData({
      skuVisible: true
    })
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    });
    this.animation = animation
    animation.translateY(-this.tranY).step()
    this.setData({
      animationSku: this.animation.export()
    })
  },
  cleanDialog() {
    this.animation.translateY(this.tranY).step()
    this.setData({
      animationSku: this.animation.export()
    })
    this.setData({
      skuVisible: false
    })
  },
  selectColor(e) {
    this.setData({
      colorIndex: e.currentTarget.dataset['index'],
      goodsCount: 0,
      countOper: ''
    })
    this.getCurrentSku()
  },
  selectSize(e) {
    this.setData({
      sizeIndex: e.currentTarget.dataset['index'],
      goodsCount: 0,
      countOper: ''
    })
    this.getCurrentSku()
  },
  numDecrease() {
    let goodsCount = this.data.goodsCount
    if (goodsCount > 0) {
      goodsCount--
      this.setData({
        goodsCount: goodsCount,
        countOper:'de'
      })
    }
  },
  numIncrease() {
    let goodsCount = this.data.goodsCount
    if (goodsCount < this.data.currentSku.stock) {
      console.log("++++++++++++++++");
      goodsCount++
      this.setData({
        goodsCount: goodsCount,
        countOper:'in'
      })
    }
  },
  submitGoods(){
  }
})
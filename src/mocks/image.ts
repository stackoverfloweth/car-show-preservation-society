import { Image } from '@/models/image'
import { MockFunction } from '@/services/mocker'
import { pick } from '@/utilities'

const cars = [
  'https://randompicturegenerator.com/img/car-generator/g293670b47f5b6ebf4c19c263379d473738b78f56e9283209fd7a8aae51743437349e545b084cfbbbe0feada458ffc7d2_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g30ca8483cddcc8536f093ca5a80e4e17d7e49eab202dd29bfecab6fb6bc37e92e1b27cd4f6ea693ba94a2de8fc455426_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g3f3c8f4af303d1723f5d5e2f3050e53373d2708f67a2db6ae4e920d6e88c8242790303c2abea53e744b1b690e79613e5_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g2d2977efe2a4edc0af5ffc6b1ee37bd54139f569629a8543abe55305c6a9f2f3e1bed65864c9c4ce403518612512f123_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/gf5b5e987539269b77867525eedee97beef3c4522cdb2b8309226045ae31f47eb14f9f5ff6cd453b691318df733b1bd5b_640.png',
  'https://randompicturegenerator.com/img/car-generator/gb3083ca3738f70532f10fe2b0b454a02e8bf975e9bdf3094163e0ec8fd210b47fda787eb6844712c77535d93e9f0f6e9_640.png',
  'https://randompicturegenerator.com/img/car-generator/g0c361fd7ccae6fd6e89c839593d0e3434986f27974ad3358d5bbdea426e1910b0f0264c13dc99e27bbcbc54941948b4b_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/gd4bacbd6972d21d93a99ef3e16e8a577bb49f3ad917acf3eefa98ee44b6acb90a055cf53d852f38005d878209ecb23d8_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g79d62766cf76e09898f323e852776aac0f14e31686f1057acfc4321791f98d29677085665211dee7a62a338a4c309fe1_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g6d45245177567ee62cc00e263a650659f53cc7ce52ce8fafaa638d57e8eb9a1d780acc1fc9c1c77796594ae753901765_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/gc435ee26c2e5dec954dcea18e0514989db75a8fb49ba278b3949b044c55178712f1df259d75795859c8e006213de0d9c_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g2289421c8d591f28a08f9b41571711c66bdaf09502db05659a87cb977f6cf48ea3bd5a24df823fcc3e0623c8974690ba_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/ge72f20c5b33e4c0a621b0bf302fb15006de3514296ec3539d8d34fc3aaad4ca02304eec448625b72bc8140446bc16005_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g155c1df1ae2db3c80d91d877ce31f24539a32f490b60eb5cb4a68d3b1fa76c0573e8c85711e1bc962c0887d439598691_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g9616fc8cd93b5012465c80487bca207748ff921a9a499a227fd3daf03b47e558b1ed2c44aa0de649f489e73485010229_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/g1fd45118c14ee701124ab9942bd9eec5b31f28ccce1e9c64e03e06fccca44accf7e8d175cbd7e42507ed41418eeddfca_640.jpg',
  'https://randompicturegenerator.com/img/car-generator/gab8e2921a9c9aa8125712c735d00e4171c2a69786cf902e19b99141f706b152f5b4d11cc31617ae73b7974848dd30901_640.jpg',
]

export const randomImage: MockFunction<Image, []> = function() {
  return {
    imageId: this.create('id'),
    // src: `https://placekitten.com/${this.create('number', [300, 600])}/${this.create('number', [300, 600])}`,
    src: pick(cars),
    size: 'cover',
    caption: `${this.create('adjective')} ${this.create('noun')}`,
  }
}
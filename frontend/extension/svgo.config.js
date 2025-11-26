export default {
  multipass: true,
  plugins: [
    // giữ viewBox để responsive
    { name: "removeViewBox", active: false },

    // bỏ width/height cứng
    { name: "removeDimensions", active: true },

    // gọn ID (tên mới trong v3)
    { name: "prefixIds", active: true },

    // xoá fill/stroke inline (dùng regex)
    // {
    //   name: "removeAttrs",
    //   params: {
    //     attrs: "(stroke|fill)",
    //   },
    // },
  ],
};

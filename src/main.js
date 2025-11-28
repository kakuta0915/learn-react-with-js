// JSXを、仮想DOM要素オブジェクトに変換するための関数
function createElement(type, props, ...children) {
  // 🔥 仮想DOM要素の基本構造を返す
  return {
    type,
    props: {
      // 🔥 受け取った props と children をまとめて props オブジェクトとして保持
      ...props,

      // 受け取った child のうち、文字列は TEXT_ELEMENT に変換
      children: children.map((child) =>
        // 🔥 子要素がオブジェクト（別の仮想DOM）ならそのまま保持し、
        // 🔥 文字列なら TEXT_ELEMENT の仮想DOMとして変換する
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// テキストノードを仮想DOMオブジェクト形式に変換する関数
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT", // ダミーのタグ名（実際のDOMには存在しない）
    props: {
      nodeValue: text, // テキスト自体を nodeValue に保存
      children: [], //  テキストは子要素を持たないので空配列
    },
  };
}

// 📝 Elementの中身
// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: [
//       {
//         type: "TEXT_ELEMENT",
//         props: {
//           nodeValue: "こんにちは",
//           children: [],
//         },
//       },
//     ],
//   },
// };

function render(element, container) {
  // const dom = document.createElement(element.type);

  // "TEXT_ELEMENT" ならテキストノード、それ以外ならHTML要素を作成
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode(element.props.nodeValue)
      : document.createElement(element.type);

  // 🔥 Objectのkeyを取得 (titleやprops)
  // 🔥 props のキーを列挙し、children 以外の項目を DOM の属性として反映する
  // 🔥（例：title, id, className などが対象）
  Object.keys(element.props)
    // 🔥 children は後で再帰処理を行うため除外する
    .filter((key) => key !== "children")
    // 🔥 残った　props（属性）を実際の DOM ノードへ代入する
    .forEach((name) => {
      // 🔥 DOM 要素のプロパティ（例：dom.title = "foo"）として値を設定する
      dom[name] = element.props[name];
    });

  // 🔥 childrenに対してレンダーし、エレメントを作成
  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

const MyReact = {
  createElement,
  render,
};

export default MyReact;

// ---------------------------
// メモ・補足
// ---------------------------

// 📝 Vite は JSX を自動で createElement に変換している（Babel の役割）。
// 🔥 これは内部仕組みを理解するための実装なので、後で削除してよい。
// ⚒ children が複数の要素を持つケースに対応していない（再帰処理が必要）。
// ⚒ props が title しか処理できていない（本来はまとめて処理するべき）。
// ⚒ TEXT_ELEMENT の扱いが非常に簡易（本家Reactは大量の最適化をしている）。

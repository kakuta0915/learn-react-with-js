// JSXを、仮想DOM要素オブジェクトに変換するための関数
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,

      // 受け取った child のうち、文字列は TEXT_ELEMENT に変換
      children: children.map((child) =>
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
      nodeValue: text,
      children: [], //  テキストは子要素を持たないので空配列
    },
  };
}

// const element = createElement("h1", { title: "foo" }, "こんにちは");
// console.log(element);

// const container = document.getElementById("root");

// const node = document.createElement(element.type);
// node["title"] = element.props.title;

// const text = document.createTextNode("");
// text["nodeValue"] = element.props.children;

// node.appendChild(text);

// container.appendChild(node);

// ReactDOM.render(element, container);

// ---------------------------
// メモ・補足
// ---------------------------

// 📝 Vite は JSX を自動で createElement に変換している（Babel の役割）。
// 🔥 これは内部仕組みを理解するための実装なので、後で削除してよい。
// ⚒ children が複数の要素を持つケースに対応していない（再帰処理が必要）。
// ⚒ props が title しか処理できていない（本来はまとめて処理するべき）。
// ⚒ TEXT_ELEMENT の扱いが非常に簡易（本家Reactは大量の最適化をしている）。

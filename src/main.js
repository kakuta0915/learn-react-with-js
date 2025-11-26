// React ====================
// function MyComponent() {
//   return <h1>こんにちは</h1>;
// }

// const container = document.getElementById("root");
// ReactDOM.render(<MyComponent />, container); // ここでレンダリングされる
//  =========================

// 上記のJSXが裏側で実際に処理される内容 (JSがほしい形に変換している) ==========
// const element = React.createElement("h1", { title: "foo" }, "こんにちは");
// const container = document.getElementById("root");
// ReactDOM.render(element, container);
// ===================================================================

// createElementをJSに置き換え =========
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "こんにちは",
  },
};

const container = document.getElementById("root");

// renderをJSに置き換え
const node = document.createElement(element.type); // h1要素を取得
node["title"] = element.props.title; // h1の属性にfooを入れる

const text = document.createTextNode(""); // 空のテキストノードを作成
text["nodeValue"] = element.props.children; // childrenプロパティを代入

node.appendChild(text); // 子要素として追加

container.appendChild(node);

// メモ
// ・裏側でviteが自動でcreateElementを作成
// ・nodeを作ってcontainerに追加することでdomに追加できる

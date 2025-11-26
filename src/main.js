// 上記のJSXが裏側で実際に処理される内容 (JSがほしい形に変換している) ==========
// const element = React.createElement("h1", { title: "foo" }, "こんにちは");
// const container = document.getElementById("root");
// ReactDOM.render(element, container);
// ===================================================================

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// オブジェクトに変換するための関数 (オブジェクトとして管理したいから)
// Reactは無理やりオブジェクトとして扱うらしい
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT", // ダミーの文字列
    props: {
      nodeValue: text,
      children: [], // テキストノードはchildrenがないので空配列
    },
  };
}

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

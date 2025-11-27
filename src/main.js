// JSXを、仮想DOM要素オブジェクトに変換するための関数
// 📝 React.createElement とほぼ同じ役割を持つ。
// 📝 children を配列形式で統一することで、後の処理（ループ・再帰）が書きやすくなる。
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,

      // 受け取った child のうち、文字列は TEXT_ELEMENT に変換
      // 📝「文字列と要素を同じ構造で扱うため」に必要。
      // 📝 Reactもこの形に変換して扱っている
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// テキストノードを仮想DOMオブジェクト形式に変換する関数
// 📝 本来ブラウザのテキストノードは特別扱いだが、Reactは統一処理のために TEXT_ELEMENT という疑似タグに変換している。
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT", // ダミーのタグ名（実際のDOMには存在しない）
    props: {
      nodeValue: text, // テキスト内容を保持
      children: [], //  テキストは子要素を持たないので空配列
    },
  };
}

// JSXを createElement に置き換えた仮想DOMオブジェクト
const element = createElement("h1", { title: "foo" }, "こんにちは");

// 表示先の DOM要素（#root）を取得
const container = document.getElementById("root");

// element.type から実際の DOM要素を作成
// 📝「仮想DOM → 本物のDOM」への変換作業に相当する。
const node = document.createElement(element.type);

// element.props の中にある属性 title を h1 に設定
// node.title = "foo" と同義。
// 📝 Reactは全 props をループしてまとめて setAttribute している。
// ⚠️ 本来は setAttribute を使うのが無難な場合もある。
node["title"] = element.props.title;

// テキストノードを空で作成
// ここで空にする理由は「後で nodeValue に文字を代入するため」。
// createTextNode に直接文字を渡しても良いが、学習のため分けている。
const text = document.createTextNode("");

// TEXT_ELEMENT の text.props.nodeValue を DOM テキストノードへ反映
// nodeValue に値を代入するとテキストが表示される。
text["nodeValue"] = element.props.children;

// h1 の中にテキストノードを追加
// → <h1 title="foo">こんにちは</h1> が形成される。
node.appendChild(text);

// 最後に h1 を #root の中に配置してブラウザに表示
container.appendChild(node);

// ---------------------------
// メモ・補足
// ---------------------------

// 📝 Vite は JSX を自動で createElement に変換している（Babel の役割）。
// 🔥 これは内部仕組みを理解するための実装なので、後で削除してよい。
// ⚒ children が複数の要素を持つケースに対応していない（再帰処理が必要）。
// ⚒ props が title しか処理できていない（本来はまとめて処理するべき）。
// ⚒ TEXT_ELEMENT の扱いが非常に簡易（本家Reactは大量の最適化をしている）。

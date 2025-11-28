// 次に処理すべき「作業単位（Unit of Work）」を保持する変数
let nextUnitOfWork_example = null;

// タスク内容を格納した配列
const tasks = [
  "タスク 1: 卵を買う",
  "タスク 2: 牛乳を買う",
  "タスク 3: パンを買う",
  "タスク 4: Reactの勉強をする",
  "タスク 5: workLoopの仕組みを理解する",
  "タスク 6: 散歩に行く",
  "タスク 7: 夕食を作る",
  "タスク 8: 映画を見る",
  "タスク 9: 歯を磨く",
  "タスク 10: 寝る",
];

// 現在のタスク番号を保持する変数
let currentTaskIndex = 0;

// タスク一覧を表示する <ul> 要素を取得する
const taskListElement = document.getElementById("taskList");

// 「処理開始」ボタンを取得する
const startButton = document.getElementById("startButton");

// 1件の作業単位（Unit of Work）を処理する関数
function performUnitOfWork_example(unitOfWork) {
  // 作業単位が存在しない、または処理が上限に達した場合は終了
  if (!unitOfWork || unitOfWork.taskIndex >= tasks.length) {
    console.log("全てのタスクが完了しました！");
    return null;
  }

  // 現在のインデックスに対応するタスク内容を取得する
  const taskText = tasks[unitOfWork.taskIndex];
  console.log(`処理中: ${taskText} (インデックス: ${unitOfWork.taskIndex})`);

  // 新しい <li> 要素を生成する
  const listItem = document.createElement("li");

  // 生成した <li> にタスク内容のテキストノードを設定する
  listItem.textContent = taskText;

  // <ul>（taskListElement）の子ノードとして追加する
  taskListElement.appendChild(listItem);

  // 次に実行すべき作業単位（次のタスク番号）を返す
  return { taskIndex: unitOfWork.taskIndex + 1 };
}

// requestIdleCallback によりアイドル時間に呼ばれるメインループ
function workLoop_example(deadline) {
  // idle 時間が足りない場合にループを抜けるためのフラグ
  let shouldYield = false;

  console.log(
    `workLoop_example開始。残り時間: ${deadline.timeRemaining().toFixed(2)}ms`
  );

  // 作業単位が残っており、かつ idle 時間に余裕がある限り処理する
  while (nextUnitOfWork_example && !shouldYield) {
    // 1つの作業単位を処理し、次の作業単位に更新する
    nextUnitOfWork_example = performUnitOfWork_example(nextUnitOfWork_example);

    // idle 時間が 1ms 未満になった場合は処理を中断する
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 次の作業が残っている場合 → 次のアイドル時間で再開
  if (nextUnitOfWork_example) {
    console.log(
      `時間切れのため中断。残り時間: ${deadline
        .timeRemaining()
        .toFixed(2)}ms。次のアイドル時に再開します。`
    );
    requestIdleCallback(workLoop_example);
  } else {
    // 全作業が完了した場合
    console.log("workLoop_example終了。全てのタスクが処理されました。");

    // ボタンを再び押せるようにし、ラベルを更新
    startButton.disabled = false;
    startButton.textContent = "処理再開 (リストはクリアされます)";
  }
}

// 「開始」ボタンがクリックされた時の処理
startButton.addEventListener("click", () => {
  console.log("処理開始ボタンが押されました。");

  // 表示済みのタスク一覧を初期化
  taskListElement.innerHTML = "";

  // タスクカウンタをリセット
  currentTaskIndex = 0;

  // 最初の作業単位（最初のタスク）を設定
  nextUnitOfWork_example = { taskIndex: currentTaskIndex };

  // ボタンを無効化して進行中表示にする
  startButton.disabled = true;
  startButton.textContent = "処理中...";

  // idle 時間に workLoop を開始するよう登録する
  requestIdleCallback(workLoop_example);
});

// ===========
// 📝 メモ
// ===========
// requestIdleCallback は ブラウザがアイドル状態になった際に実行される関数をキューに登録できる。(ブラウザが暇になったら実行される関数を事前登録して、暇になったら実行する。)

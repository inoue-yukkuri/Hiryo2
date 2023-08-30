/* eslint-disable camelcase */
import solver from 'javascript-lp-solver';
import csv from 'csvtojson';

export default function LPsolver() {
  // ここで実際の計算を行います。
  // 今はシンプルなタイムアウトを使用していますが、将来的にはここに線形計画法のアルゴリズムを実装します。
  // eslint-disable-next-line max-len

  async function loadCSV(filename) {
    return csv().fromFile(filename);
  }

  const solveProblem = (
    c_hiryou,
    cost,
    c_yasai_W,
    c_yasai_K,
    c_yasai_N,
    c_yasai_P,
    c_hiryo_list_K,
    c_hiryo_list_N,
    c_hiryo_list_P,
  ) => {
    let model = {
      optimize: 'cost',
      opType: 'min',
      constraints: {},
      variables: {},
    };

    // 変数の定義と肥料の範囲制約
    c_hiryou.forEach((h, i) => {
      model.variables[h] = {
        cost: cost[h],
        N: c_hiryo_list_N[i],
        P: c_hiryo_list_P[i],
        K: c_hiryo_list_K[i],
        totalWeight: 1, // 各肥料の合計重量制約のため
      };
      // 各肥料の範囲制約は変数オブジェクト内で定義
      model.variables[h].min = 0;
      model.variables[h].max = 10000;
    });

    // 成分誤差の制約
    model.constraints.N = { min: c_yasai_N - 0.1, max: c_yasai_N + 0.1 };
    model.constraints.P = { min: c_yasai_P - 0.1, max: c_yasai_P + 0.1 };
    model.constraints.K = { min: c_yasai_K - 0.1, max: c_yasai_K + 0.1 };
    model.constraints.totalWeight = { min: c_yasai_W };

    // 肥料の合計重量がc_yasai_W以下になる制約
    model.constraints.totalWeight = { min: c_yasai_W };
    c_hiryou.forEach((h) => {
      model.variables[h][h] = 1; // 各肥料の合計重量制約のため
    });

    // 目的関数の定義
    c_hiryou.forEach((h) => {
      model.variables[h].cost = cost[h];
    });

    console.log(model);

    // 問題を解く
    let result = solver.Solve(model);

    // 解の取得
    if (result.feasible) {
      // 画像の表示は省略

      let hituyouryou = [];
      c_hiryou.forEach((h) => {
        let roundedValue = Math.round(result[h] * 10) / 10;
        hituyouryou.push(`${roundedValue}g`);
      });

      // データフレームの作成と表示
      console.log('肥料名\t必要量（g/m²）');
      for (let i = 0; i < c_hiryou.length; i++) {
        console.log(`${c_hiryou[i]}\t${hituyouryou[i]}`);
      }

      // テキストの表示
      console.log('計算結果は1ｍ²（1m×1m）に撒く必要がある各々の重さ(g)です');

      let totalCost = c_hiryou.reduce((sum, h) => sum + cost[h] * result[h], 0);
      console.log(`1ｍ²あたりの肥料の総費用：約${Math.round(totalCost)}円`);

      console.log('おしらせ');
      // その他のお知らせやリンクの表示
    } else {
      // 画像やエラーメッセージの表示
      console.log('Status: Infeasible\nごめんなさい！計算できませんでした');
      console.log(
        '選んだ肥料の成分が偏っています\n肥料の種類を増やしてください'
      );
      console.log(
        '選ぶのが手間でしたら\nすべての肥料を選択してください\nその中から必要なものを自動で抜粋します'
      );
    }
  };

  async function main() {
    console.log('Main function started');

    console.log('Reading CSV files...');
    const hiryou_df = await loadCSV('../../assets/hiryou0313.csv');
    const yasai_df = await loadCSV('../../assets/yasai0228.csv');

    // 選択された野菜と肥料
    const c_yasai = 'トマト';
    const c_hiryou = [
      '牛ふん堆肥',
      '発酵鶏ふん',
      '豚ふん堆肥',
      '油かす',
      '骨粉',
      'もみ殻',
    ];

    // 定数の定義
    const cost = hiryou_df.reduce((obj, row) => {
      obj[row.hiryou] = parseFloat(row.Price); // 数値に変換
      return obj;
    }, {});

    const newData = yasai_df.map((row) => ({
      [row.yasai]: [
        parseFloat(row.N),
        parseFloat(row.P),
        parseFloat(row.K),
        parseFloat(row.W),
      ],
    }));

    const require = newData.reduce((a, c) => Object.assign(a, c), {});

    const newData1 = hiryou_df.map((row) => ({
      [row.hiryou]: [parseFloat(row.N), parseFloat(row.P), parseFloat(row.K)],
    }));

    const nutrition = newData1.reduce((a, c) => Object.assign(a, c), {});

    // yasai
    const c_yasai_req = require[c_yasai];
    const c_yasai_N = c_yasai_req[0];
    const c_yasai_P = c_yasai_req[1];
    const c_yasai_K = c_yasai_req[2];
    const c_yasai_W = c_yasai_req[3];
    // hiryou
    const c_hiryo_list_N = [];
    const c_hiryo_list_P = [];
    const c_hiryo_list_K = [];

    c_hiryou.forEach((h) => {
      const nutrition_sample = nutrition[h];
      c_hiryo_list_N.push(nutrition_sample[0]);
      c_hiryo_list_P.push(nutrition_sample[1]);
      c_hiryo_list_K.push(nutrition_sample[2]);
    });

    // ここで問題を解く関数を呼び出す
    const result = solveProblem(
      c_hiryou,
      cost,
      c_yasai_W,
      c_yasai_K,
      c_yasai_N,
      c_yasai_P,
      c_hiryo_list_K,
      c_hiryo_list_N,
      c_hiryo_list_P,
    );
  }

  main();
}

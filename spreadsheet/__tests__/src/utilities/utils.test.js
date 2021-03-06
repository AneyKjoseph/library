import { applyFormula } from "../../../src/utilities/utils";

test('Utils - applyFormula - addition test', () => {

    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=SUM(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 30});

    obj[columnName] = "=ADD(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 30});

    obj[columnName] = "=sum(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 30});

    obj[columnName] = "=add(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 30});

    obj[columnName] = "=add(20:20)";

    var result = applyFormula(obj, columnName);
    expect(result).not.toEqual({"total": 30});
});

test('Utils - applyFormula - multiplication test', () => {

    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=MUL(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 200});

    obj[columnName] = "=mul(10:20)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 200});

    obj[columnName] = "=mul(20:20)";

    var result = applyFormula(obj, columnName);
    expect(result).not.toEqual({"total": 200});
});

test('Utils - applyFormula - subtraction test', () => {
    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=SUB(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=sub(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=DIFF(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=diff(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=diff(20:20)";

    var result = applyFormula(obj, columnName);
    expect(result).not.toEqual({"total": 10});
    
});

test('Utils - applyFormula - min test', () => {
    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=min(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=MIN(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 10});

    obj[columnName] = "=MIN(20:20)";

    var result = applyFormula(obj, columnName);
    expect(result).not.toEqual({"total": 10});
    
});

test('Utils - applyFormula - max test', () => {
    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=max(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 20});

    obj[columnName] = "=MAX(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual({"total": 20});

    obj[columnName] = "=MAX(20:20)";

    var result = applyFormula(obj, columnName);
    expect(result).not.toEqual({"total": 10});
    
});

test('Utils - applyFormula - no calculation test', () => {
    var obj = {};
    var columnName = 'total';
    obj[columnName] = "=abc(20:10)";

    var result = applyFormula(obj, columnName);
    expect(result).toEqual(obj);
    
});


const res = pm.response.json();
const expr = pm.iterationData.get("expression");
const expected = pm.iterationData.get("expected");

pm.test(`Expression ${expr} should equal ${expected}`, function () {
    pm.expect(Number(res.result)).to.eql(Number(expected));
});
const res = pm.response.json();
const expr = pm.iterationData.get("expression");
const expected = pm.iterationData.get("expected");

pm.test(`Expression ${expr} should return error '${expected}'`, function () {
    pm.expect(res.error).to.include(expected);
});
/* global describe, it */

describe('The built library is a commonjs2 module', function checkBuildArtefacts() {
  this.timeout(15000);
  it('should expose "stage", "connectStaged", and "reducer"', () => {
    require('..').should.have.keys('stage', 'connectStaged', 'reducer');
  });
});

import chai from 'chai';
import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(spies);
chai.use(chaiAsPromised);

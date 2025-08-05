// const { verifyOtp } = require('../controllers/');
const { verifyOtp } = require('../controllers/userAuthController');
const User = require('../models/userModel');

jest.mock('../models/userModel');

describe('verifyOtp controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        email: 'test@example.com',
        otp: '123456',
      },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 200 if OTP is valid', async () => {
    const fakeUser = {
      otp: '123456',
      otpExpires: new Date(Date.now() + 60000), // not expired
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(fakeUser);

    await verifyOtp(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(fakeUser.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Otp verified' });
  });

  it('should return 400 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await verifyOtp(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'user not found' });
  });
});

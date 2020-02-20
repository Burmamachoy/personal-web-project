import { Test, TestingModule } from '@nestjs/testing';
import { CabeceraCarritoService } from './cabecera-carrito.service';

describe('CabeceraCarritoService', () => {
  let service: CabeceraCarritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabeceraCarritoService],
    }).compile();

    service = module.get<CabeceraCarritoService>(CabeceraCarritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

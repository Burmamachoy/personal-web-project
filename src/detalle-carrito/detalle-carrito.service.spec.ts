import { Test, TestingModule } from '@nestjs/testing';
import { DetalleCarritoService } from './detalle-carrito.service';

describe('DetalleCarritoService', () => {
  let service: DetalleCarritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleCarritoService],
    }).compile();

    service = module.get<DetalleCarritoService>(DetalleCarritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

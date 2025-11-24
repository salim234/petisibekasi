export interface Signer {
  id: string;
  name: string;
  position: string; // Jabatan di Desa
  address: string; // Alamat Lengkap
  signature: string; // Base64 data of signature
  timestamp: Date;
}

export interface PetitionStats {
  totalSignatures: number;
  target: number;
}
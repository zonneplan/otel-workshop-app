import {Injectable} from "@nestjs/common";
import {Client} from "pg";

@Injectable()
export class InstructionRepository {
  public constructor(
    private readonly databaseClient: Client
  ) {
  }

  public async setInstructionStatus(instructionId: number, status: string): Promise<void> {
    await this.databaseClient.query(`
      INSERT INTO instructions (id, status)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE
      SET status = $2;
    `, [instructionId.toString(), status]);
  }

  public async getInstructionStatus(instructionId: number): Promise<string | null> {
    const result = await this.databaseClient.query(`
      SELECT status
      FROM instructions
      WHERE id = $1;
    `, [instructionId.toString()]);

    return result.rows[0]?.status ?? null;
  }
}

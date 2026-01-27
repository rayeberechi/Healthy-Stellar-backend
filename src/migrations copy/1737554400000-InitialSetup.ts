import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialSetup1737554400000 implements MigrationInterface {
  name = 'InitialSetup1737554400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'timestamp',
            type: 'timestamp with time zone',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'operation',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'entity_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'entity_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'ip_address',
            type: 'inet',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'changes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'old_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'success'",
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'execution_time_ms',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'request_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'session_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_entity',
        columnNames: ['entity_type', 'entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_operation',
        columnNames: ['operation'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'IDX_audit_logs_timestamp',
        columnNames: ['timestamp'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'query_cache',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'identifier',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'time',
            type: 'bigint',
            default: 0,
          },
          {
            name: 'duration',
            type: 'integer',
            default: 0,
          },
          {
            name: 'query',
            type: 'text',
          },
          {
            name: 'result',
            type: 'text',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      COMMENT ON TABLE audit_logs IS 'HIPAA-compliant audit trail for all database operations';
    `);

    await queryRunner.query(`
      ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
    `);

    await queryRunner.query(`
      CREATE POLICY audit_logs_read_policy ON audit_logs
      FOR SELECT
      USING (true);
    `);

    await queryRunner.query(`
      CREATE POLICY audit_logs_insert_policy ON audit_logs
      FOR INSERT
      WITH CHECK (true);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_trigger_function()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'DELETE') THEN
          INSERT INTO audit_logs (operation, entity_type, entity_id, user_id, old_values)
          VALUES ('DELETE', TG_TABLE_NAME, OLD.id, COALESCE(current_setting('app.current_user_id', true), 'system'), row_to_json(OLD));
          RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO audit_logs (operation, entity_type, entity_id, user_id, old_values, new_values)
          VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, COALESCE(current_setting('app.current_user_id', true), 'system'), row_to_json(OLD), row_to_json(NEW));
          RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
          INSERT INTO audit_logs (operation, entity_type, entity_id, user_id, new_values)
          VALUES ('INSERT', TG_TABLE_NAME, NEW.id, COALESCE(current_setting('app.current_user_id', true), 'system'), row_to_json(NEW));
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await queryRunner.query(`
      COMMENT ON FUNCTION audit_trigger_function() IS 'Automatic audit logging trigger for HIPAA compliance';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION IF EXISTS audit_trigger_function');
    await queryRunner.query('DROP POLICY IF EXISTS audit_logs_insert_policy ON audit_logs');
    await queryRunner.query('DROP POLICY IF EXISTS audit_logs_read_policy ON audit_logs');
    await queryRunner.query('DROP FUNCTION IF EXISTS update_updated_at_column');
    await queryRunner.dropTable('query_cache');
    await queryRunner.dropTable('audit_logs');
    await queryRunner.query('DROP EXTENSION IF EXISTS "pgcrypto"');
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
  }
}

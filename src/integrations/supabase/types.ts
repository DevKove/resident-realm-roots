export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      acessos_portaria: {
        Row: {
          categoria: string
          condominio_id: string
          created_at: string
          id: string
          observacoes: string | null
          pessoa: string
          placa: string | null
          registrado_em: string
          registrado_por: string | null
          tipo: string
          unidade_id: string | null
        }
        Insert: {
          categoria?: string
          condominio_id: string
          created_at?: string
          id?: string
          observacoes?: string | null
          pessoa: string
          placa?: string | null
          registrado_em?: string
          registrado_por?: string | null
          tipo?: string
          unidade_id?: string | null
        }
        Update: {
          categoria?: string
          condominio_id?: string
          created_at?: string
          id?: string
          observacoes?: string | null
          pessoa?: string
          placa?: string | null
          registrado_em?: string
          registrado_por?: string | null
          tipo?: string
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acessos_portaria_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acessos_portaria_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      animais: {
        Row: {
          condominio_id: string
          created_at: string
          especie: string | null
          id: string
          nome: string
          observacoes: string | null
          porte: string | null
          raca: string | null
          unidade_id: string | null
        }
        Insert: {
          condominio_id: string
          created_at?: string
          especie?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          porte?: string | null
          raca?: string | null
          unidade_id?: string | null
        }
        Update: {
          condominio_id?: string
          created_at?: string
          especie?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          porte?: string | null
          raca?: string | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animais_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      areas_comuns: {
        Row: {
          ativa: boolean
          capacidade: number | null
          condominio_id: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          requer_aprovacao: boolean
          taxa: number
        }
        Insert: {
          ativa?: boolean
          capacidade?: number | null
          condominio_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          requer_aprovacao?: boolean
          taxa?: number
        }
        Update: {
          ativa?: boolean
          capacidade?: number | null
          condominio_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          requer_aprovacao?: boolean
          taxa?: number
        }
        Relationships: [
          {
            foreignKeyName: "areas_comuns_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas: {
        Row: {
          cancelado_em: string | null
          condominio_id: string
          created_at: string
          external_id: string | null
          id: string
          inicio: string
          plano_id: string
          provider: string | null
          renovacao: string | null
          status: string
          trial_fim: string | null
          updated_at: string
        }
        Insert: {
          cancelado_em?: string | null
          condominio_id: string
          created_at?: string
          external_id?: string | null
          id?: string
          inicio?: string
          plano_id: string
          provider?: string | null
          renovacao?: string | null
          status?: string
          trial_fim?: string | null
          updated_at?: string
        }
        Update: {
          cancelado_em?: string | null
          condominio_id?: string
          created_at?: string
          external_id?: string | null
          id?: string
          inicio?: string
          plano_id?: string
          provider?: string | null
          renovacao?: string | null
          status?: string
          trial_fim?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: true
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria: {
        Row: {
          acao: string
          condominio_id: string | null
          created_at: string
          dados: Json | null
          id: string
          registro_id: string | null
          tabela: string
          user_id: string | null
        }
        Insert: {
          acao: string
          condominio_id?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          registro_id?: string | null
          tabela: string
          user_id?: string | null
        }
        Update: {
          acao?: string
          condominio_id?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      avisos: {
        Row: {
          condominio_id: string
          conteudo: string
          created_at: string
          created_by: string | null
          expira_em: string | null
          fixado: boolean
          id: string
          prioridade: string
          titulo: string
        }
        Insert: {
          condominio_id: string
          conteudo: string
          created_at?: string
          created_by?: string | null
          expira_em?: string | null
          fixado?: boolean
          id?: string
          prioridade?: string
          titulo: string
        }
        Update: {
          condominio_id?: string
          conteudo?: string
          created_at?: string
          created_by?: string | null
          expira_em?: string | null
          fixado?: boolean
          id?: string
          prioridade?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "avisos_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_financeiras: {
        Row: {
          condominio_id: string
          created_at: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          condominio_id: string
          created_at?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          condominio_id?: string
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_financeiras_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas: {
        Row: {
          condominio_id: string
          created_at: string
          descricao: string
          id: string
          pago_em: string | null
          status: string
          unidade_id: string
          valor: number
          vencimento: string
        }
        Insert: {
          condominio_id: string
          created_at?: string
          descricao: string
          id?: string
          pago_em?: string | null
          status?: string
          unidade_id: string
          valor: number
          vencimento: string
        }
        Update: {
          condominio_id?: string
          created_at?: string
          descricao?: string
          id?: string
          pago_em?: string | null
          status?: string
          unidade_id?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      condominios: {
        Row: {
          bloqueado: boolean
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          created_by: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          regras_reserva: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          bloqueado?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          regras_reserva?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          bloqueado?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          regras_reserva?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          updated_at: string
          valor: Json
        }
        Insert: {
          chave: string
          updated_at?: string
          valor: Json
        }
        Update: {
          chave?: string
          updated_at?: string
          valor?: Json
        }
        Relationships: []
      }
      convites: {
        Row: {
          aceito_em: string | null
          condominio_id: string
          created_at: string
          created_by: string | null
          email: string
          id: string
          papel: Database["public"]["Enums"]["cond_role"]
          unidade_id: string | null
        }
        Insert: {
          aceito_em?: string | null
          condominio_id: string
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          papel?: Database["public"]["Enums"]["cond_role"]
          unidade_id?: string | null
        }
        Update: {
          aceito_em?: string | null
          condominio_id?: string
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          papel?: Database["public"]["Enums"]["cond_role"]
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "convites_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          categoria_id: string | null
          condominio_id: string
          created_at: string
          created_by: string | null
          data: string
          descricao: string
          fornecedor: string | null
          id: string
          status: string
          valor: number
          vencimento: string | null
        }
        Insert: {
          categoria_id?: string | null
          condominio_id: string
          created_at?: string
          created_by?: string | null
          data?: string
          descricao: string
          fornecedor?: string | null
          id?: string
          status?: string
          valor: number
          vencimento?: string | null
        }
        Update: {
          categoria_id?: string | null
          condominio_id?: string
          created_at?: string
          created_by?: string | null
          data?: string
          descricao?: string
          fornecedor?: string | null
          id?: string
          status?: string
          valor?: number
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "despesas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "despesas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          arquivo_path: string
          categoria: string
          condominio_id: string
          created_at: string
          created_by: string | null
          descricao: string | null
          id: string
          mime: string | null
          tamanho: number | null
          titulo: string
          visibilidade: string
        }
        Insert: {
          arquivo_path: string
          categoria?: string
          condominio_id: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          mime?: string | null
          tamanho?: number | null
          titulo: string
          visibilidade?: string
        }
        Update: {
          arquivo_path?: string
          categoria?: string
          condominio_id?: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          mime?: string | null
          tamanho?: number | null
          titulo?: string
          visibilidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      enquete_opcoes: {
        Row: {
          condominio_id: string
          enquete_id: string
          id: string
          ordem: number
          texto: string
        }
        Insert: {
          condominio_id: string
          enquete_id: string
          id?: string
          ordem?: number
          texto: string
        }
        Update: {
          condominio_id?: string
          enquete_id?: string
          id?: string
          ordem?: number
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquete_opcoes_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquete_opcoes_enquete_id_fkey"
            columns: ["enquete_id"]
            isOneToOne: false
            referencedRelation: "enquetes"
            referencedColumns: ["id"]
          },
        ]
      }
      enquete_votos: {
        Row: {
          condominio_id: string
          created_at: string
          enquete_id: string
          id: string
          opcao_id: string
          user_id: string
        }
        Insert: {
          condominio_id: string
          created_at?: string
          enquete_id: string
          id?: string
          opcao_id: string
          user_id?: string
        }
        Update: {
          condominio_id?: string
          created_at?: string
          enquete_id?: string
          id?: string
          opcao_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquete_votos_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquete_votos_enquete_id_fkey"
            columns: ["enquete_id"]
            isOneToOne: false
            referencedRelation: "enquetes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enquete_votos_opcao_id_fkey"
            columns: ["opcao_id"]
            isOneToOne: false
            referencedRelation: "enquete_opcoes"
            referencedColumns: ["id"]
          },
        ]
      }
      enquetes: {
        Row: {
          condominio_id: string
          created_at: string
          created_by: string | null
          descricao: string | null
          encerra_em: string | null
          id: string
          status: string
          titulo: string
        }
        Insert: {
          condominio_id: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          encerra_em?: string | null
          id?: string
          status?: string
          titulo: string
        }
        Update: {
          condominio_id?: string
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          encerra_em?: string | null
          id?: string
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquetes_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      entregas: {
        Row: {
          codigo_rastreio: string | null
          condominio_id: string
          created_at: string
          descricao: string
          id: string
          recebido_em: string
          registrado_por: string | null
          remetente: string | null
          retirado_em: string | null
          retirado_por: string | null
          status: string
          transportadora: string | null
          unidade_id: string | null
        }
        Insert: {
          codigo_rastreio?: string | null
          condominio_id: string
          created_at?: string
          descricao: string
          id?: string
          recebido_em?: string
          registrado_por?: string | null
          remetente?: string | null
          retirado_em?: string | null
          retirado_por?: string | null
          status?: string
          transportadora?: string | null
          unidade_id?: string | null
        }
        Update: {
          codigo_rastreio?: string | null
          condominio_id?: string
          created_at?: string
          descricao?: string
          id?: string
          recebido_em?: string
          registrado_por?: string | null
          remetente?: string | null
          retirado_em?: string | null
          retirado_por?: string | null
          status?: string
          transportadora?: string | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entregas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          admissao: string | null
          ativo: boolean
          cargo: string | null
          condominio_id: string
          created_at: string
          email: string | null
          id: string
          nome: string
          telefone: string | null
          turno: string | null
        }
        Insert: {
          admissao?: string | null
          ativo?: boolean
          cargo?: string | null
          condominio_id: string
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          telefone?: string | null
          turno?: string | null
        }
        Update: {
          admissao?: string | null
          ativo?: boolean
          cargo?: string | null
          condominio_id?: string
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          turno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      membros_condominio: {
        Row: {
          ativo: boolean
          condominio_id: string
          created_at: string
          id: string
          papel: Database["public"]["Enums"]["cond_role"]
          unidade_id: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean
          condominio_id: string
          created_at?: string
          id?: string
          papel: Database["public"]["Enums"]["cond_role"]
          unidade_id?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean
          condominio_id?: string
          created_at?: string
          id?: string
          papel?: Database["public"]["Enums"]["cond_role"]
          unidade_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membros_condominio_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membros_condominio_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      moradores: {
        Row: {
          ativo: boolean
          condominio_id: string
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          principal: boolean
          telefone: string | null
          tipo: string
          unidade_id: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          condominio_id: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          principal?: boolean
          telefone?: string | null
          tipo?: string
          unidade_id?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          condominio_id?: string
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          principal?: boolean
          telefone?: string | null
          tipo?: string
          unidade_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moradores_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moradores_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          condominio_id: string | null
          created_at: string
          id: string
          lida: boolean
          link: string | null
          mensagem: string | null
          titulo: string
          user_id: string
        }
        Insert: {
          condominio_id?: string | null
          created_at?: string
          id?: string
          lida?: boolean
          link?: string | null
          mensagem?: string | null
          titulo: string
          user_id: string
        }
        Update: {
          condominio_id?: string | null
          created_at?: string
          id?: string
          lida?: boolean
          link?: string | null
          mensagem?: string | null
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencia_comentarios: {
        Row: {
          condominio_id: string
          created_at: string
          id: string
          ocorrencia_id: string
          texto: string
          user_id: string
        }
        Insert: {
          condominio_id: string
          created_at?: string
          id?: string
          ocorrencia_id: string
          texto: string
          user_id?: string
        }
        Update: {
          condominio_id?: string
          created_at?: string
          id?: string
          ocorrencia_id?: string
          texto?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencia_comentarios_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencia_comentarios_ocorrencia_id_fkey"
            columns: ["ocorrencia_id"]
            isOneToOne: false
            referencedRelation: "ocorrencias"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencia_historico: {
        Row: {
          condominio_id: string
          created_at: string
          id: string
          ocorrencia_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          condominio_id: string
          created_at?: string
          id?: string
          ocorrencia_id: string
          status: string
          user_id?: string | null
        }
        Update: {
          condominio_id?: string
          created_at?: string
          id?: string
          ocorrencia_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencia_historico_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencia_historico_ocorrencia_id_fkey"
            columns: ["ocorrencia_id"]
            isOneToOne: false
            referencedRelation: "ocorrencias"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          categoria: string
          condominio_id: string
          created_at: string
          created_by: string
          descricao: string | null
          id: string
          prioridade: string
          responsavel: string | null
          status: string
          titulo: string
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          categoria?: string
          condominio_id: string
          created_at?: string
          created_by?: string
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel?: string | null
          status?: string
          titulo: string
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string
          condominio_id?: string
          created_at?: string
          created_by?: string
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel?: string | null
          status?: string
          titulo?: string
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          max_condominios: number
          max_unidades: number | null
          nome: string
          ordem: number
          preco: number
          recursos: string[]
          slug: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          max_condominios?: number
          max_unidades?: number | null
          nome: string
          ordem?: number
          preco?: number
          recursos?: string[]
          slug: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          max_condominios?: number
          max_unidades?: number | null
          nome?: string
          ordem?: number
          preco?: number
          recursos?: string[]
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          telefone: string | null
          tema: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          tema?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          tema?: string
          updated_at?: string
        }
        Relationships: []
      }
      receitas: {
        Row: {
          categoria_id: string | null
          condominio_id: string
          created_at: string
          created_by: string | null
          data: string
          descricao: string
          forma_pagamento: string | null
          id: string
          unidade_id: string | null
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          condominio_id: string
          created_at?: string
          created_by?: string | null
          data?: string
          descricao: string
          forma_pagamento?: string | null
          id?: string
          unidade_id?: string | null
          valor: number
        }
        Update: {
          categoria_id?: string | null
          condominio_id?: string
          created_at?: string
          created_by?: string | null
          data?: string
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          unidade_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "receitas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_financeiras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          area_id: string
          condominio_id: string
          created_at: string
          created_by: string
          data: string
          fim: string
          id: string
          inicio: string
          observacoes: string | null
          status: string
          unidade_id: string | null
        }
        Insert: {
          area_id: string
          condominio_id: string
          created_at?: string
          created_by?: string
          data: string
          fim?: string
          id?: string
          inicio?: string
          observacoes?: string | null
          status?: string
          unidade_id?: string | null
        }
        Update: {
          area_id?: string
          condominio_id?: string
          created_at?: string
          created_by?: string
          data?: string
          fim?: string
          id?: string
          inicio?: string
          observacoes?: string | null
          status?: string
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_comuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          area: number | null
          bloco: string
          condominio_id: string
          created_at: string
          id: string
          numero: string
          observacoes: string | null
          situacao: string
          tipo: string
          updated_at: string
          vagas: number
        }
        Insert: {
          area?: number | null
          bloco?: string
          condominio_id: string
          created_at?: string
          id?: string
          numero: string
          observacoes?: string | null
          situacao?: string
          tipo?: string
          updated_at?: string
          vagas?: number
        }
        Update: {
          area?: number | null
          bloco?: string
          condominio_id?: string
          created_at?: string
          id?: string
          numero?: string
          observacoes?: string | null
          situacao?: string
          tipo?: string
          updated_at?: string
          vagas?: number
        }
        Relationships: [
          {
            foreignKeyName: "unidades_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          condominio_id: string
          cor: string | null
          created_at: string
          id: string
          modelo: string | null
          placa: string
          tipo: string
          unidade_id: string | null
        }
        Insert: {
          condominio_id: string
          cor?: string | null
          created_at?: string
          id?: string
          modelo?: string | null
          placa: string
          tipo?: string
          unidade_id?: string | null
        }
        Update: {
          condominio_id?: string
          cor?: string | null
          created_at?: string
          id?: string
          modelo?: string | null
          placa?: string
          tipo?: string
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      visitantes: {
        Row: {
          condominio_id: string
          created_at: string
          documento: string | null
          entrada: string
          id: string
          nome: string
          observacoes: string | null
          registrado_por: string | null
          saida: string | null
          telefone: string | null
          tipo: string
          unidade_id: string | null
        }
        Insert: {
          condominio_id: string
          created_at?: string
          documento?: string | null
          entrada?: string
          id?: string
          nome: string
          observacoes?: string | null
          registrado_por?: string | null
          saida?: string | null
          telefone?: string | null
          tipo?: string
          unidade_id?: string | null
        }
        Update: {
          condominio_id?: string
          created_at?: string
          documento?: string | null
          entrada?: string
          id?: string
          nome?: string
          observacoes?: string | null
          registrado_por?: string | null
          saida?: string | null
          telefone?: string | null
          tipo?: string
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitantes_condominio_id_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitantes_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aceitar_convites: { Args: never; Returns: number }
      has_cond_role: {
        Args: {
          _cid: string
          _roles: Database["public"]["Enums"]["cond_role"][]
        }
        Returns: boolean
      }
      is_gestor: { Args: { _cid: string }; Returns: boolean }
      is_member: { Args: { _cid: string }; Returns: boolean }
      is_operacional: { Args: { _cid: string }; Returns: boolean }
      is_super_admin: { Args: { _uid: string }; Returns: boolean }
      minhas_unidades: { Args: { _cid: string }; Returns: string[] }
      recursos_do_condominio: { Args: { _cid: string }; Returns: string[] }
    }
    Enums: {
      app_role: "super_admin"
      cond_role:
        | "admin"
        | "sindico"
        | "subsindico"
        | "morador"
        | "funcionario"
        | "porteiro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin"],
      cond_role: [
        "admin",
        "sindico",
        "subsindico",
        "morador",
        "funcionario",
        "porteiro",
      ],
    },
  },
} as const

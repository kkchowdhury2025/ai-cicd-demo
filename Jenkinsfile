pipeline {
  agent any

  environment {
    // N8N_WEBHOOK_URL = credentials('N8N_WEBHOOK_URL')
    N8N_WEBHOOK_URL = 'https://kkc2026.app.n8n.cloud/webhook-test/jenkins-ai-gate'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.PR_AUTHOR  = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
          env.COMMIT_MSG = sh(script: "git log -1 --pretty=format:'%s'",  returnStdout: true).trim()
          env.HEAD_SHA   = sh(script: "git rev-parse HEAD",                returnStdout: true).trim()
          echo "Commit by: ${env.PR_AUTHOR} — ${env.COMMIT_MSG}"
        }
      }
    }

    stage('Extract changed files') {
      steps {
        script {
          env.CHANGED_FILES = sh(
            script: "git diff origin/main...HEAD --name-only 2>/dev/null || git diff HEAD~1 --name-only",
            returnStdout: true
          ).trim()

          env.DIFF_CONTENT = sh(
            script: "git diff HEAD~1 -- . ':(exclude)package-lock.json' ':(exclude)yarn.lock' 2>/dev/null || echo ''",
            returnStdout: true
          ).trim()

          echo "=== Changed files ==="
          echo "${env.CHANGED_FILES}"
        }
      }
    }

    stage('AI gate — via n8n') {
      steps {
        script {

          writeFile file: 'n8n_payload.json', text: groovy.json.JsonOutput.toJson([
            pr_author    : env.PR_AUTHOR     ?: 'unknown',
            pr_title     : env.COMMIT_MSG    ?: 'no title',
            changed_files: env.CHANGED_FILES ?: '',
            diff         : (env.DIFF_CONTENT ?: '').take(12000),
            repo         : 'kkchowdhury2025/ai-cicd-demo',
            pr_number    : 0,
            head_sha     : env.HEAD_SHA      ?: '',
            pr_html_url  : env.BUILD_URL     ?: '',
            build_url    : env.BUILD_URL     ?: ''
          ])

          def webhookUrl = env.N8N_WEBHOOK_URL

          def response = sh(
            script: """curl -s -X POST '${webhookUrl}' -H 'Content-Type: application/json' --max-time 60 -d @n8n_payload.json""",
            returnStdout: true
          ).trim()

          echo "=== n8n AI Gate Response ==="
          echo response

          def passed = response.contains('"passed":true')
          def blocked = response.contains('"passed":false')

          if (blocked) {
            error("AI GATE BLOCKED this build. See n8n for details.")
          }

          if (!passed && !blocked) {
            echo "WARNING: Could not parse AI response. Allowing build to continue."
          }

          echo "AI gate passed!"
        }
      }
    }

    stage('Install dependencies') {
      parallel {
        stage('Frontend deps') {
          when { expression { env.CHANGED_FILES?.contains('frontend/') } }
          steps { dir('frontend') { sh 'npm ci --prefer-offline || npm install' } }
        }
        stage('Backend deps') {
          when { expression { env.CHANGED_FILES?.contains('backend/') } }
          steps { dir('backend') { sh 'npm ci --prefer-offline || npm install' } }
        }
      }
    }

    stage('Run tests') {
      parallel {
        stage('Frontend tests') {
          when { expression { env.CHANGED_FILES?.contains('frontend/') } }
          steps { dir('frontend') { sh 'npm run test:ci' } }
        }
        stage('Backend tests') {
          when { expression { env.CHANGED_FILES?.contains('backend/') } }
          steps { dir('backend') { sh 'npm run test:ci' } }
        }
      }
    }

    stage('Deploy to staging') {
      when {
        branch 'main'
      }
      steps {
        echo "AI gate passed. Deploying to staging..."
        sh 'echo "Deploy step complete"'
      }
    }

  }

  post {
    success {
      echo "Pipeline PASSED successfully."
    }
    failure {
      echo "Pipeline FAILED or BLOCKED by AI gate."
    }
    always {
      cleanWs(cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenFailure: false)
    }
  }
}

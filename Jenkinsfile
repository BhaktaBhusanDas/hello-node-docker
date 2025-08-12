    pipeline {
        agent any

        environment {
            DOCKER_CREDENTIALS = 'docker-hub-creds'
            IMAGE_NAME         = "bhaktabhusandas/hello-node-app"
            IMAGE_TAG          = "${env.BUILD_NUMBER}"
            FULL_IMAGE         = "${IMAGE_NAME}:${IMAGE_TAG}"
        }

        stages {
            stage('Checkout') {
                steps {
                    git branch: 'main',
                    url: 'https://github.com/BhaktaBhusanDas/hello-node-docker.git'
                }
            }

            stage('Build Application') {
                steps {
                    sh 'npm install'
                    echo "Dummy test passed."
                }
            }

            stage('Build Docker Image') {
                steps {
                    script {
                        def img = docker.build(FULL_IMAGE)
                    }
                }
            }

            stage('Push Docker Image') {
                steps {
                    script {
                        docker.withRegistry('', DOCKER_CREDENTIALS) {
                            sh "docker push ${FULL_IMAGE}"
                            sh "docker tag ${FULL_IMAGE} ${IMAGE_NAME}:latest"
                            sh "docker push ${IMAGE_NAME}:latest"
                        }
                    }
                }
            }

            stage('Deploy To Server') {
                steps {
                    script {
                        sh "docker rm -f hello-node-app || true"
                        sh "docker run -d -p 3000:3000 --health-cmd='curl -f http://localhost:3000/ || exit 1' \
                        --name hello-node-app ${FULL_IMAGE}"
                    }
                }
                post {
                    failure {
                        sh "docker rm -f hello-node-app || true"
                        sh "docker run -d -p 3000:3000 --name hello-node-app ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
        post {
            success {
                echo "Deployment successful: ${FULL_IMAGE}"
            }
            failure {
                echo "Build or deployment failed; rolled back to latest"
            }
        }
    }
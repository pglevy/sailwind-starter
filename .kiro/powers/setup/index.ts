import { PowerContext } from '@kiroai/power-builder'

export default {
  name: 'setup',
  description: 'Automatically set up your development environment and launch the Sailwind Starter project',
  
  async execute(context: PowerContext) {
    const { executeCommand, say } = context

    say('🚀 Setting up your development environment...\n')

    // 1. Check current environment
    say('📋 Checking what\'s already installed...')
    
    const hasHomebrew = await checkInstalled(executeCommand, 'brew', 'Homebrew')
    const hasNvm = await checkInstalled(executeCommand, 'nvm', 'nvm')
    const hasNode = await checkInstalled(executeCommand, 'node', 'Node.js')
    
    // 2. Install missing prerequisites
    if (!hasHomebrew) {
      say('\n📦 Installing Homebrew (this may take a few minutes)...')
      await executeCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"')
      say('✅ Homebrew installed!')
    }

    if (!hasNvm) {
      say('\n📦 Installing nvm (Node Version Manager)...')
      await executeCommand('brew install nvm')
      
      // Configure nvm
      await executeCommand('mkdir -p ~/.nvm')
      await executeCommand('echo \'export NVM_DIR="$HOME/.nvm"\' >> ~/.zshrc')
      await executeCommand('echo \'[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \\. "/opt/homebrew/opt/nvm/nvm.sh"\' >> ~/.zshrc')
      
      say('✅ nvm installed!')
    }

    if (!hasNode) {
      say('\n📦 Installing Node.js LTS...')
      await executeCommand('source ~/.zshrc && nvm install --lts && nvm use --lts && nvm alias default node')
      say('✅ Node.js installed!')
    }

    // 3. Install project dependencies
    say('\n📦 Installing project dependencies (this may take 2-3 minutes)...')
    try {
      await executeCommand('npm install')
      say('✅ Dependencies installed!')
    } catch (error) {
      say('⚠️  Error installing dependencies. You may need to run `npm install` manually.')
      throw error
    }

    // 4. Start dev server
    say('\n🚀 Starting development server...')
    say('   The server will run at http://localhost:5173')
    say('   Press Ctrl+C in the terminal to stop it when you\'re done.\n')
    
    await executeCommand('npm run dev')

    return {
      success: true,
      message: '✨ Setup complete! Your Sailwind Starter is running at http://localhost:5173'
    }
  }
}

async function checkInstalled(
  executeCommand: PowerContext['executeCommand'],
  command: string,
  name: string
): Promise<boolean> {
  try {
    await executeCommand(`which ${command}`)
    console.log(`✅ ${name} is already installed`)
    return true
  } catch {
    console.log(`❌ ${name} not found`)
    return false
  }
}

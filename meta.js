const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Goal = require('../../models/Goal');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meta')
        .setDescription('Gerencia suas metas financeiras')
        .addSubcommand(sub =>
            sub.setName('criar')
                .setDescription('Cria uma nova meta')
                .addStringOption(opt => opt.setName('nome').setDescription('Nome da meta').setRequired(true))
                .addNumberOption(opt => opt.setName('valor').setDescription('Valor total da meta').setRequired(true))
                .addIntegerOption(opt => opt.setName('prazo').setDescription('Prazo em meses').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('adicionar')
                .setDescription('Adiciona valor a uma meta')
                .addStringOption(opt => opt.setName('nome').setDescription('Nome da meta').setRequired(true))
                .addNumberOption(opt => opt.setName('valor').setDescription('Valor a adicionar').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('status')
                .setDescription('Mostra o status das suas metas')),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (sub === 'criar') {
            const name = interaction.options.getString('nome');
            const targetAmount = interaction.options.getNumber('valor');
            const deadlineMonths = interaction.options.getInteger('prazo');

            await Goal.create({ userId, name, targetAmount, deadlineMonths });
            await interaction.reply(`✅ Meta **${name}** de R$ ${targetAmount.toFixed(2)} criada com sucesso!`);
        } 
        
        else if (sub === 'adicionar') {
            const name = interaction.options.getString('nome');
            const amount = interaction.options.getNumber('valor');

            const goal = await Goal.findOne({ userId, name });
            if (!goal) return interaction.reply('❌ Meta não encontrada.');

            goal.currentAmount += amount;
            await goal.save();

            const percent = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
            await interaction.reply(`💰 Adicionado R$ ${amount.toFixed(2)} à meta **${name}**. Progresso: ${percent}%`);
        }

        else if (sub === 'status') {
            const goals = await Goal.find({ userId });
            if (goals.length === 0) return interaction.reply('Você não tem metas criadas.');

            const embed = new EmbedBuilder()
                .setTitle('🎯 Suas Metas Financeiras')
                .setColor(0xF1C40F);

            goals.forEach(g => {
                const percent = ((g.currentAmount / g.targetAmount) * 100).toFixed(2);
                const monthlyIdeal = (g.targetAmount / g.deadlineMonths).toFixed(2);
                embed.addFields({
                    name: g.name,
                    value: `Progresso: R$ ${g.currentAmount.toFixed(2)} / R$ ${g.targetAmount.toFixed(2)} (${percent}%)\nIdeal por mês: R$ ${monthlyIdeal}`
                });
            });

            await interaction.reply({ embeds: [embed] });
        }
    },
};
